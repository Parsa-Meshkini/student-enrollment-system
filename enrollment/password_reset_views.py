from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .password_reset_serializers import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_request(request):
    ser = PasswordResetRequestSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    email = ser.validated_data["email"]

    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_RESET_URL}?uid={uid}&token={token}"

        send_mail(
            subject="Reset your password",
            message=f"Reset link: {reset_link}",
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            recipient_list=[user.email],
            fail_silently=False,
        )

    return Response({"detail": "If an account exists, a reset link was sent."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    ser = PasswordResetConfirmSerializer(data=request.data)
    ser.is_valid(raise_exception=True)

    uid = ser.validated_data["uid"]
    token = ser.validated_data["token"]
    new_password = ser.validated_data["new_password"]

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id, is_active=True)
    except Exception:
        return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
