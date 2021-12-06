from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Insight(models.Model):
    """
    Model representing insight.
    """

    id = models.BigAutoField(verbose_name="ID", primary_key=True)
    link = models.ForeignKey(
        verbose_name=_("Link"),
        to="links.link",
        on_delete=models.CASCADE,
        related_name="insights",
    )
    ip_address = models.CharField(
        verbose_name=_("IP address"),
        help_text=_("IP address of the visitor"),
        max_length=45,
    )
    visit_time = models.DateTimeField(verbose_name=_("Visit time"), auto_now_add=True)

    class Meta:
        verbose_name = _("Insight")
        verbose_name_plural = _("Insights")
        unique_together = []
        ordering = ["visit_time"]

    def clean(self):
        pass

    def __str__(self):
        return f"{self.link} by {self.ip_address}"

    def get_absolute_url(self):
        return reverse("insights:detail", kwargs={"pk": self.pk})
