from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from redirink.insights.pagination import InsightPagination
from redirink.insights.views import InsightListViewSet
from redirink.links.views import LinkViewSet
from redirink.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("links", LinkViewSet)
router.register("insights", InsightListViewSet)


app_name = "api"
urlpatterns = router.urls
