"""Test insight model is working the way it should."""
import pytest
from django.core.exceptions import ValidationError
from django.db import DataError

from .factories import InsightFactory

pytestmark = pytest.mark.django_db


def test_create_new_fake_visitor_instance_using_factory(visitor):
    pass


def test_create_new_instance_using_model_factory(insight):
    pass


def test_fake_instance_is_valid(insight):
    # Should not raise ValidationError
    insight.full_clean()


def test_fake_instance_have_right_fields(insight):
    assert isinstance(insight.id, int)
    assert insight.time is not None


def test_invalid_ip_address():
    with pytest.raises(DataError):
        InsightFactory(visitor__ip_address="invalid ip")


def test_valid_fake_ip_v6_address(faker):
    InsightFactory(visitor__ip_address=faker.ipv6())
