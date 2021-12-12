from django.core.exceptions import ValidationError
from django.db import DataError, IntegrityError, InternalError

from config import celery_app
from redirink.insights.models import Insight, Visitor
from redirink.links.models import Link


@celery_app.task()
def track_insight(pk: int, address: str) -> int:
    """Track the insight made by request client.

    Return id of the created insight (serialized data).
    """

    link = Link.objects.get(pk=pk)

    try:
        visitor, created = Visitor.objects.get_or_create(ip_address=address)
        if created:
            visitor.full_clean()

        insight = Insight.objects.create(link=link, visitor=visitor)
        return insight.id
    except (DataError, IntegrityError, InternalError, ValidationError) as e:
        # If validation error occurs (IP address is invalid) just skip this
        insight = Insight.objects.create(link=link)
        return insight.pk
