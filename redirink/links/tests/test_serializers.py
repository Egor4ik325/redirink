import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.timezone import localtime

from redirink.links.serializers import LinkSerializer

User = get_user_model()

pytestmark = pytest.mark.django_db


def test_link_is_valid(link_dict, link_data, rq):
    rq.user = link_dict["user"]
    serializer = LinkSerializer(data=link_data, context={"request": rq})

    assert serializer.is_valid()


def test_duplicate_user_to_url_fields(rq, link, link_data):
    rq.user = link.user
    serializer = LinkSerializer(
        data=link_data | {"to_url": link.to_url}, context={"request": rq}
    )

    assert not serializer.is_valid()


# Test serialized data
def test_serialized_data(rq, link):
    serializer = LinkSerializer(instance=link, context={"request": rq})
    redirect_path = reverse("links:redirect", kwargs={"pk": link.pk})

    # NOTE: time is always stored in UTC but serializer converts it to the local time (specific by TIME_ZONE setting)
    # so any model objects will have UTC time zone it will needed to be convertedd to Europe/Moscow
    assert serializer.data == {
        "pk": link.pk,
        "to_url": link.to_url,
        "create_time": localtime(link.create_time).isoformat().replace("+00:00", "Z"),
        "from_url": f"{rq.scheme}://{rq.get_host()}{redirect_path}",
    }


def test_serialized_from_url(rq, link):
    serializer = LinkSerializer(instance=link, context={"request": rq})
    redirect_path = reverse("links:redirect", kwargs={"pk": link.pk})

    assert (
        serializer.data["from_url"] == f"{rq.scheme}://{rq.get_host()}{redirect_path}"
    )


def test_serializer_request_user_is_set():
    pass
