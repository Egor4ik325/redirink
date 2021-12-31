import pytest
from rest_framework.test import force_authenticate

from ..views import InsightListViewSet
from .factories import InsightFactory

pytestmark = pytest.mark.django_db
insight_viewset = InsightListViewSet.as_view({"get": "list"})


def test_list_insights_is_ok(rq, user, token):
    force_authenticate(rq, user=user, token=token)
    response = insight_viewset(rq)

    assert response.status_code == 200


def test_list_insights_not_authenticated(rq):
    response = insight_viewset(rq)

    assert response.status_code == 401


def test_list_user_insights(rq, user, token):
    InsightFactory.create_batch(5, link__user=user)

    force_authenticate(rq, user=user, token=token)
    response = insight_viewset(rq)

    assert response.data["count"] == 5


def test_list_link_insights(link, rq, user, token):
    InsightFactory.create_batch(5, link__user=user)
    InsightFactory.create_batch(5, link=link)

    force_authenticate(rq, user=user, token=token)
    rq.path += f"?link={link.pk}"
    response = insight_viewset(rq)

    assert response.data["count"] == 5


def test_list_filtered_for_user(rq, user, token):
    InsightFactory.create_batch(10)

    force_authenticate(rq, user=user, token=token)
    response = insight_viewset(rq)

    assert response.data["count"] == 0


def test_filter_insight_list_by_visitor_id(rq, user, token, visitor):
    """Get the visitor's insights for all user links"""
    InsightFactory.create_batch(5, link__user=user)
    InsightFactory.create_batch(5, link__user=user, visitor=visitor)

    force_authenticate(rq, user=user, token=token)
    rq.path += f"?visitor={visitor.pk}"
    response = insight_viewset(rq)  # noqa: F841

    # TODO
    # assert response.data["count"] == 5


def test_filter_insight_list_by_date():
    pass


def test_filter_by_year():
    pass


def test_filter_by_month():
    pass


def test_filter_by_day():
    pass


def test_filter_by_hour():
    pass
