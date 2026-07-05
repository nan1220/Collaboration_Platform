from rest_framework.authentication import BaseAuthentication

from .models import User


class DemoUserAuthentication(BaseAuthentication):
    """Mock/dev-only auth: trusts an X-User-Id header naming one of the seeded
    demo users. There is no password or session — this exists so the frontend
    can demonstrate role-gated views without building real auth/SSO yet.
    """

    def authenticate(self, request):
        user_id = request.headers.get("X-User-Id")
        if not user_id:
            return None
        try:
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError):
            return None
        return (user, None)
