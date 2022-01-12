from allauth.socialaccount import adapter, providers
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter
from allauth.socialaccount.views import SocialLogin
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.utils.http import urlencode
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    schema,
)
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL


google_login_view = GoogleLoginView.as_view()


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
@schema(None)
def google_redirect_view(request: Request, *args, **kwargs):
    """
    Generate URL of Google authorization server for use in frontend (to redirect client).

    It will populate it with:

    - client_id (set in project settings)
    - scope (depends on project settings)
    - redirect_uri (callback_url)
    """
    adapter = GoogleOAuth2Adapter(request)
    provider = adapter.get_provider()
    app = provider.get_app(request)

    # For google: https://accounts.google.com/o/oauth2/v2/auth
    authorize_base_url = adapter.authorize_url
    callback_url = adapter.get_callback_url(request, app)
    scope: list = provider.get_scope(request)

    # Close to how `OAuth2Client.get_redirect_url` works
    authorize_params = {
        "client_id": app.client_id,
        "redirect_uri": callback_url,
        "scope": " ".join(scope),
        "response_type": "code",
        "access_type": "offline",
        "include_granted_scopes": "true",
    }
    action = request.query_params.get("action", "authenticate")
    extra_authorize_params = provider.get_auth_params(request, action)
    authorize_params.update(extra_authorize_params)

    redirect_url = f"{authorize_base_url}?{urlencode(authorize_params)}"
    return Response({"redirect_url": redirect_url})
