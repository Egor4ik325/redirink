import shortuuid
from rest_framework import filters, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from redirink.links.models import Link
from redirink.links.pagination import LinkPagination
from redirink.links.permissions import LinkPermission
from redirink.links.serializers import LinkSerializer

link_uuid_length = Link._meta.get_field("uuid").length
link_uuid_alphabet = Link._meta.get_field("uuid").alphabet or shortuuid.get_alphabet()


class LinkViewSet(viewsets.ModelViewSet):
    """
    ViewSet for link.
    """

    # Queryset and serialization
    queryset = Link.objects.all()
    serializer_class = LinkSerializer

    # URLconf
    lookup_field = "pk"
    lookup_url_kwarg = "pk"
    lookup_value_regex = f"[{link_uuid_alphabet}]{{{link_uuid_length}}}"

    # Authentication and authorization
    authentication_classes = [TokenAuthentication]
    permission_classes = [LinkPermission]

    # Result correction
    pagination_class = LinkPagination
    filter_backends = [
        filters.OrderingFilter,
    ]
    ordering_fields = ["create_time"]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
