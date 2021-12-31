import pytest

from ..serializers import InsightSerializer

pytestmark = pytest.mark.django_db


def test_serializer_insight_files_count_and_data_types(insight):
    serializer = InsightSerializer(instance=insight)
    data = serializer.data

    assert len(data) == 3, "Only 3 data fields should be present."
    assert "link" in data, "Link UUID should be in data"
    assert "visitor_id" in data, "Visitor id should be in data"
    assert "time" in data, "Visit time should be in data"
