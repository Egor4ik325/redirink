from django.apps.config import AppConfig


class LinksConfig(AppConfig):
    """
    Application config for links.
    """

    name = "redirink.links"
    verbose_name = "_(Redirect links)"
    label = "links"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        pass
