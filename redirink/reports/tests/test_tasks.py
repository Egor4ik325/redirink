import pytest
from celery.result import EagerResult
from django.core import mail

from redirink.users.tests.factories import UserFactory

from ..tasks import send_bulk_insight_report

# from django.core.mail.u


pytestmark = pytest.mark.django_db


def test_send_mass_weekly_insight_emails():
    UserFactory.create_batch(5)
    result = send_bulk_insight_report.apply()

    assert isinstance(result, EagerResult), "Result should be known already"
    assert result.result == 5, "5 email should be sent"
    assert len(mail.outbox) == 5, "5 email should be sent overall"


def test_number_of_emails_last_week():
    pass
