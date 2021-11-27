from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField

User = get_user_model()


class Link(models.Model):
    """
    Model representing link.
    """

    uuid = ShortUUIDField(verbose_name="Unique identifier", length=8, primary_key=True)
    user = models.ForeignKey(
        verbose_name=_("User"),
        to=User,
        on_delete=models.CASCADE,
        related_name="links",
    )
    to_url = models.URLField(_("To URL"), max_length=200)
    create_time = models.DateTimeField(_("Create time"), auto_now_add=True)

    @property
    def from_url(self):
        # return reverse("links:redirect", kwargs={"pk": self.pk})
        return "TODO"

    class Meta:
        verbose_name = _("Redirect link")
        verbose_name_plural = _("Redirect links")
        unique_together = ["user", "to_url"]
        ordering = ["-create_time"]

    def clean(self):
        pass

    def __str__(self):
        return self.to_url

    def get_absolute_url(self):
        return reverse("links:detail", kwargs={"pk": self.pk})
