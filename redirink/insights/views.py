from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .filters import InsightFilter
from .models import Insight
from .pagination import InsightPagination
from .serializers import InsightSerializer


class InsightListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    ViewSet for listing user/link insight.
    """

    # Queryset and serialization
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer

    # Authentication and authorization
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Result correction
    pagination_class = InsightPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = InsightFilter
    search_fields = []
    ordering_fields = []

    def get_queryset(self):
        return self.queryset.filter(link__user=self.request.user)
