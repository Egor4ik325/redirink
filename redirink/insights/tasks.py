from django.core.exceptions import ValidationError
from django.db import DataError, IntegrityError, InternalError

from config import celery_app
from redirink.insights.models import Insight, Visitor
from redirink.links.models import Link


@celery_app.task()
def track_insight(pk: int, address: str) -> Insight:
    """Track the insight made by request client."""

    link = Link.objects.get(pk=pk)

    try:
        visitor, created = Visitor.objects.get_or_create(ip_address=address)
        if created:
            visitor.full_clean()

        return Insight.objects.create(link=link, visitor=visitor)
    except (DataError, IntegrityError, InternalError, ValidationError) as e:
        # If validation error occurs (IP address is invalid) just skip this
        return Insight.objects.create(link=link)
