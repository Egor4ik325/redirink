from rest_framework import serializers

from redirink.links.models import Link


class LinkSerializer(serializers.ModelSerializer):
    """
    Serializer to dict for link.
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Link
        fields = ["pk", "user", "to_url", "create_time", "from_url"]
        extra_kwargs = {
            "pk": {"read_only": True},
            "create_time": {"read_only": True},
        }

    def validate(self, data: dict) -> dict:
        return data
