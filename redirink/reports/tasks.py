from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives, get_connection, send_mail
from django.db.models import Count, Exists, OuterRef
from django.db.models.expressions import Subquery
from django.db.models.fields import IntegerField
from django.db.models.functions import Coalesce
from django.db.models.query import QuerySet
from django.template.loader import render_to_string
from django.utils.timezone import now

from redirink.insights.models import Insight

User = get_user_model()


@shared_task
def send_bulk_insight_report():
    """
    Send weekly insight report to all users.

    Return number of emails sent.
    """
    users = get_users_annotated_previous_week_insight_count()
    connection = get_connection()
    messages = []
    for user in users:
        context = {"user": user, "insight_count": user.week_insights_count}
        message = render_to_string("insight_report.txt", context)
        html_message = render_to_string("insight_report.html", context)
        message = EmailMultiAlternatives(
            subject="Weekly Insight Report",
            body=message,
            from_email=None,
            to=[user.email],
        )
        message.attach_alternative(html_message, "text/html")
        messages.append(message)
    return connection.send_messages(messages)


def get_users_annotated_previous_week_insight_count() -> QuerySet:
    """Annotate each users with the number of insights filtered by previous week number."""
    # Get all users with number of insights previous week:
    # ```sql
    # SELECT users_user.username, COUNT(insights_insight.id) AS week_insights FROM users_user
    # INNER JOIN links_link ON links_link.user_id = users_user.id
    # INNER JOIN insights_insight ON insights_insight.link_id = links_link.uuid
    # WHERE date_part('week', insights_insight.time) = date_part('week', now()) - 1
    # GROUP BY users_user.username;
    # ```

    # Or in annotated form (annotate each user with it's number of insights):
    # ```sql
    # SELECT username,
    # (
    #   SELECT COUNT(*)
    #   FROM insights_insight
    #   INNER JOIN links_link ON links_link.uuid = insights_insight.link_id
    #   WHERE
    #       links_link.user_id = users_user.id
    #       AND
    #       date_part('week', insights_insight.time) = date_part('week', now()) - 1
    # ) AS week_insights_count
    # FROM users_user;
    # ```

    # Annotate each users with the number of insights filtered by previous week number:
    week_insights = (
        Insight.objects.filter(
            link__user_id=OuterRef("pk"), time__week=now().isocalendar().week - 1
        )
        # Required to implement subquery count
        .values("link__user")
        .annotate(count=Count("pk"))
        .values("count")  # return only the count
    )
    users = User.objects.annotate(
        week_insights_count=Coalesce(
            Subquery(week_insights, output_field=IntegerField()), 0
        )
    )
    return users
