from allauth.account.views import confirm_email
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views import defaults as default_views
from django.views.generic import TemplateView

from redirink.authentication.views import google_login_view, google_redirect_view

# MVT URLs (template pages, admin, static files, email confirmation)
urlpatterns = [
    # Template server pages
    # path("", TemplateView.as_view(template_name="pages/home.html"), name="home"),
    # path("about/", TemplateView.as_view(template_name="pages/about.html"), name="about"),
    # User and account management
    path("users/", include("redirink.users.urls", namespace="users")),
    path("accounts/", include("allauth.urls")),
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # Static files while development under /static URL
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLs
urlpatterns += [
    # API base url
    path("api/", include("config.api_router")),
    # DRF token auth + allauth account management endpoints
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/signup/", include("dj_rest_auth.registration.urls")),
    path("api/auth/signup/google/", google_login_view, name="google_login"),
    path(
        "api/auth/signup/google/redirect/", google_redirect_view, name="google_redirect"
    ),
]

# Override urls
urlpatterns += [
    # Email confirmation
    # - this url will be included into confirmation email (reversed url_name)
    # - email confirmation will be handled directly by the server
    # - then user can login via any frontend
    re_path(
        r"^api/auth/email/confirm/(?P<key>[-:\w]+)/$",
        confirm_email,
        name="account_confirm_email",
    ),
    # For API-based email confirmation (will not be used)
    path(
        "api/auth/signup/email/verify/",
        lambda: None,  # type: ignore
        name="account_email_verification_sent",
    ),
]

# Debug URLs
if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns

# Generic URLs
urlpatterns += [
    # Capture short URL links
    path("", include("redirink.links.urls", namespace="links")),
]

# Frontend (react-router) URLs
urlpatterns += [
    re_path(".*", TemplateView.as_view(template_name="index.html"), name="react"),
]

# MVT URLs only for reversing (mapping url_name to path)
urlpatterns += [
    # Override callback url for constructing redirect url (will be only reversed)
    path(
        settings.GOOGLE_OAUTH_CALLBACK_PATH,
        lambda: None,  # type: ignore
        name="google_callback",
    ),
]
