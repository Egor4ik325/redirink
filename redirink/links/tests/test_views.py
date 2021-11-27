import pytest

from redirink.links.views import link_redirect_view

pytestmark = pytest.mark.django_db


def test_link_redirect_view_found_301(rq, link):
    response = link_redirect_view(rq, link.pk)

    assert response.status_code == 301


def test_link_redirect_location_redirect_header_is_link_to_url(rq, link):
    response = link_redirect_view(rq, link.pk)

    assert response.headers["Location"] == link.to_url


# Negative cases


def test_link_redirect_view_not_existing_404(rq):
    response = link_redirect_view(rq, "non-existing-link-pk")

    assert response.status_code == 404
