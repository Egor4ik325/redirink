import factory
import pytest

from redirink.links.tests.factories import LinkFactory


@pytest.fixture
def link_dict():
    """Return the dictionary of all model fields with the actual values not serial values."""
    return factory.build(dict, FACTORY_CLASS=LinkFactory)


@pytest.fixture
def link_data(link_dict):
    """Data for creating link as in request.data."""
    data = link_dict.copy()
    del data["user"]
    return data
