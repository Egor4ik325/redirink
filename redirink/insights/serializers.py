from rest_framework import serializers

from .models import Insight


class InsightSerializer(serializers.ModelSerializer):
    """
    Serializer to dict for insight.
    """

    class Meta:
        model = Insight
        fields = ["link", "visitor_id", "time"]
        extra_kwargs = {}
