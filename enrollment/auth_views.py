from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .auth_serializers import RegisterSerializer, MeSerializer
from .models import Student


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response({"detail": "Registered successfully."}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    # request.user -> Student
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response(MeSerializer(student).data)
