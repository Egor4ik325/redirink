from rest_framework import decorators, filters, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.schemas.openapi import AutoSchema

from redirink.links.models import Link, link_uuid_alphabet, link_uuid_length
from redirink.links.pagination import LinkPagination
from redirink.links.permissions import LinkPermission
from redirink.links.serializers import LinkSerializer


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


@decorators.api_view(["GET"])
@decorators.authentication_classes([])
@decorators.permission_classes([AllowAny])
@decorators.throttle_classes([])
@decorators.schema(AutoSchema)
def link_redirect_view(request: Request, pk: str):
    """
    Redirect to the link's `to_url` URL from short UUID.
    """

    link = get_object_or_404(Link, pk=pk)
    return Response(
        status=status.HTTP_301_MOVED_PERMANENTLY,
        headers={"Location": link.to_url},
    )
