from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class InsightsConfig(AppConfig):
    """
    Application config for insights.
    """

    name = "redirink.insights"
    verbose_name = _("Insights")
    label = "insights"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        pass
