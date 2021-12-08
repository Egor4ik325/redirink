import uuid

from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Visitor(models.Model):
    """
    Model representing unauthenticated visitor.

    User by insight analytics system to calculate number of unique insights.
    """

    id = models.UUIDField(
        verbose_name=_("ID"), primary_key=True, default=uuid.uuid4, editable=False
    )
    # primary key "proxied" by UUID (not null, unique, indexed)
    ip_address = models.GenericIPAddressField(
        _("IP address of the visitor"),
        protocol="both",
        unpack_ipv4=False,
        db_index=True,
        null=False,
        unique=True,
    )

    class Meta:
        verbose_name = _("Visitor")
        verbose_name_plural = _("Visitors")

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("visitors:detail", kwargs={"pk": self.pk})


class Insight(models.Model):
    """
    Model representing insight (request to the short URL made by user).
    """

    id = models.BigAutoField(verbose_name="ID", primary_key=True)
    link = models.ForeignKey(
        verbose_name=_("Link"),
        to="links.link",
        on_delete=models.CASCADE,
        related_name="insights",
    )
    visitor = models.ForeignKey(
        verbose_name=_("Visitor"),
        to=Visitor,
        on_delete=models.CASCADE,
        related_name="insights",
        editable=True,
        null=True,
        unique=False,
        default=None,
        blank=True,
    )
    time = models.DateTimeField(verbose_name=_("Visit time"), auto_now_add=True)

    class Meta:
        verbose_name = _("Insight")
        verbose_name_plural = _("Insights")
        ordering = ["time"]

    def clean(self):
        pass

    def __str__(self):
        return f"{self.link} by {self.visitor}"

    def get_absolute_url(self):
        return reverse("insights:detail", kwargs={"pk": self.pk})
