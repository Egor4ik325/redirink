from django_filters import rest_framework as filters

from redirink.insights.models import Insight


class InsightFilter(filters.FilterSet):
    """
    Filter set for insight model.
    """

    class Meta:
        model = Insight
        fields = ["link", "visitor", "time"]
