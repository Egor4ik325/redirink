import factory
import pytest
from django.urls import reverse

from redirink.links.models import Link
from redirink.links.tests.factories import LinkFactory

pytestmark = pytest.mark.django_db


def test_link_list(api_client, user, token):
    # Authentication for Session auth + Token auth
    api_client.force_authenticate(user)
    # Authentication for Token auth
    # api_client.user = user
    # api_client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = api_client.get(reverse("api:link-list"))

    assert response.status_code == 200


def test_link_list_content(api_client, user, token):
    api_client.force_authenticate(user)
    factory.create_batch(Link, 5, FACTORY_CLASS=LinkFactory, user=user)
    response = api_client.get(reverse("api:link-list"))

    assert response.data["count"] == 5


def test_link_create_is_201(api_client, user, token, link_data):
    api_client.force_authenticate(user)
    response = api_client.post(reverse("api:link-list"), data=link_data)

    assert response.status_code == 201


# Redirect API/MVT endpoints/routes


def test_client_request_link_response_should_be_redirect_301_without_auth(
    api_client, link
):
    response = api_client.get(reverse("links:redirect", kwargs={"pk": link.pk}))

    assert response.status_code == 301


def test_client_request_link_response_should_be_redirect_to_link_url_to(
    api_client, link
):
    response = api_client.get(reverse("links:redirect", kwargs={"pk": link.pk}))

    assert response.headers["Location"] == link.to_url
