import pytest
from django.urls import Resolver404, resolve, reverse

pytestmark = pytest.mark.django_db


def test_links_list_url():
    assert reverse("api:link-list") == "/api/links/"
    assert resolve("/api/links/").view_name == "api:link-list"


def test_links_detail_url_found(link):
    assert (
        reverse("api:link-detail", kwargs={"pk": link.pk}) == f"/api/links/{link.pk}/"
    )
    assert resolve(f"/api/links/{link.pk}/").view_name == "api:link-detail"


def test_links_detail_lookup_valid_alphabet():
    assert resolve("/api/links/abcdefgh/").view_name == "api:link-detail"


def test_links_detail_lookup_invalid_length():
    with pytest.raises(Resolver404):
        resolve("/api/links/abcdefg/")


def test_links_detail_lookup_invalid_alphabet():
    with pytest.raises(Resolver404):
        resolve("/api/links/abcde0fg/")


def test_link_redirect_url():
    assert reverse("links:redirect", kwargs={"pk": "abcdefgh"}) == "/abcdefgh/"
    assert resolve("/abcdefgh/").view_name == "links:redirect"


# Negative cases


def test_link_redirect_url_7_length():
    with pytest.raises(Resolver404):
        resolve("/abcdefg/")


def test_link_redirect_url_contains_1():
    with pytest.raises(Resolver404):
        resolve("/abcde1gh/")
