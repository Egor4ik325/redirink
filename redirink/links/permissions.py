from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet

from redirink.links.models import Link


class LinkPermission(permissions.IsAuthenticated):
    """
    Authorization for link.
    """

    def has_object_permission(
        self, request: Request, view: GenericViewSet, obj: Link
    ) -> bool:
        return request.user == obj.user
