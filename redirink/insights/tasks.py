from config import celery_app
from redirink.insights.models import Insight
from redirink.links.models import Link


@celery_app.task()
def track_insight(pk: int, address: str) -> Insight:
    """Track the insight made by request client."""

    link = Link.objects.get(pk=pk)
    return Insight.objects.create(link=link, ip_address=address)
