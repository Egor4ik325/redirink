import pytest
from celery.result import EagerResult

from ..models import Insight
from ..tasks import track_insight

pytestmark = pytest.mark.django_db


def test_count_insight_task(settings, link, faker):
    """A basic test to execute the get_users_count Celery task."""
    settings.CELERY_TASK_ALWAYS_EAGER = True
    address = faker.ipv4()
    task_result = track_insight.delay(link.pk, address)
    assert isinstance(task_result, EagerResult)
    # Insight should be created and saved into database
    insight = Insight.objects.get(pk=task_result.result.pk)
    assert insight.visitor.ip_address == address
