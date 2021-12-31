import pytest

from redirink.insights.models import Insight
from redirink.links.views import link_redirect_view

pytestmark = pytest.mark.django_db


def test_link_redirect_view_found_301(rq, link):
    response = link_redirect_view(rq, link.pk)

    assert response.status_code == 301


def test_link_redirect_location_redirect_header_is_link_to_url(rq, link):
    response = link_redirect_view(rq, link.pk)

    assert response.headers["Location"] == link.to_url


def test_link_redirect_insight_created(settings, rq, link, faker):
    # Wait for tasks to finish
    settings.CELERY_TASK_ALWAYS_EAGER = True
    address = faker.ipv4()
    rq.META["REMOTE_ADDR"] = address
    response = link_redirect_view(rq, link.pk)

    assert response.status_code == 301
    assert link.insights.count() == 1
    assert Insight.objects.filter(link=link).exists()
    assert Insight.objects.get(link=link).visitor.ip_address == address


# Negative cases


def test_link_redirect_view_not_existing_404(rq):
    response = link_redirect_view(rq, "non-existing-link-pk")

    assert response.status_code == 404
