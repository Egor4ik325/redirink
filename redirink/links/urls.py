from django.urls import re_path

from redirink.links.models import link_uuid_alphabet, link_uuid_length
from redirink.links.views import link_redirect_view

app_name = "links"
urlpatterns = [
    re_path(
        f"^(?P<pk>[{link_uuid_alphabet}]{{{link_uuid_length}}})/$",
        link_redirect_view,
        name="redirect",
    ),
]
