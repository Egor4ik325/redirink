from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ReactConfig(AppConfig):
    """
    Convenient application for react, this contains:

    - templates (root index.html for React)
    - static files (static and meta files linked by index.html)
    """

    name = "redirink.react"  # full name
    label = "react"  # short name
    verbose_name = _("React")  # verbose name
