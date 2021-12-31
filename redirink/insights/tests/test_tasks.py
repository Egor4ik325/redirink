import pytest
from celery.result import EagerResult

from ..models import Insight
from ..tasks import track_insight

pytestmark = pytest.mark.django_db(transaction=True)


def test_count_insight_task(settings, link, faker):
    settings.CELERY_TASK_ALWAYS_EAGER = True
    address = faker.ipv4()
    task_result = track_insight.delay(link.pk, address)
    assert isinstance(task_result, EagerResult)
    # Insight should be created and saved into database
    insight = Insight.objects.get(pk=task_result.result)
    assert insight.visitor.ip_address == address


def test_address_is_empty_insight_visitor_should_be_none(settings, link):
    settings.CELERY_TASK_ALWAYS_EAGER = True
    task_result = track_insight.delay(link.pk, "")
    # Insight should be created and saved into database (without )
    insight = Insight.objects.get(pk=task_result.result)
    assert insight.visitor is None


def test_address_is_invalid_insight_visitor_should_be_none(settings, link):
    settings.CELERY_TASK_ALWAYS_EAGER = True
    task_result = track_insight.delay(link.pk, "1932.91829.19.19982")
    # Insight should be created and saved into database (without )
    insight = Insight.objects.get(pk=task_result.result)
    assert insight.visitor is None
