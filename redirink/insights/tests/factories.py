"""
Model factory filled with fake data automatically.

Used for creating new instances fast for testing purposes.
"""
import factory

from redirink.insights.models import Insight, Visitor
from redirink.links.tests.factories import LinkFactory


class VisitorFactory(factory.django.DjangoModelFactory):
    """
    Factory for visitor.
    """

    ip_address = factory.Faker("ipv4")  # fake IPv4 address

    class Meta:
        model = Visitor


class InsightFactory(factory.django.DjangoModelFactory):
    """
    Factory for insight.
    """

    link = factory.SubFactory(LinkFactory)  # auto-create fake link
    visitor = factory.SubFactory(VisitorFactory)  # auto-generate fake visitor

    class Meta:
        model = Insight
