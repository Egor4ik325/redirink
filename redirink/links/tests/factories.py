import factory
from factory.django import DjangoModelFactory

from redirink.links.models import Link
from redirink.users.tests.factories import UserFactory


class LinkFactory(DjangoModelFactory):
    """
    Factory for link.
    """

    user = factory.SubFactory(UserFactory)
    to_url = factory.Faker("url")

    class Meta:
        model = Link
