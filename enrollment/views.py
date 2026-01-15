from django.db.models import Count, Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from .models import Student
from rest_framework.permissions import IsAuthenticated, AllowAny



from .models import Student, Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer, EnrollActionSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def course_list(request):

    qs = Course.objects.annotate(
        enrolled_count=Count("enrollments", filter=Q(enrollments__status=Enrollment.Status.ENROLLED))
    ).order_by("code")

    return Response(CourseSerializer(qs, many=True).data)


@api_view(["GET"])
def student_enrollments(request, student_id: int):
    qs = Enrollment.objects.filter(student_id=student_id).select_related("course", "course__instructor")
    return Response(EnrollmentSerializer(qs, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll(request):
    ser = EnrollActionSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    course_id = ser.validated_data["course_id"]

    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"detail": "Student profile not found for this user."},
                        status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        try:
            course = Course.objects.select_for_update().get(id=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        enrolled_count = Enrollment.objects.filter(
            course=course,
            status=Enrollment.Status.ENROLLED
        ).count()

        if enrolled_count >= course.capacity:
            return Response({"detail": "Course is full."}, status=status.HTTP_409_CONFLICT)

        enrollment, created = Enrollment.objects.get_or_create(
            student=student,
            course=course,
            defaults={"status": Enrollment.Status.ENROLLED},
        )

        if not created and enrollment.status == Enrollment.Status.DROPPED:
            enrollment.status = Enrollment.Status.ENROLLED
            enrollment.save(update_fields=["status"])

    return Response({"detail": "Enrolled successfully."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def drop(request):
    ser = EnrollActionSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    course_id = ser.validated_data["course_id"]

    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"detail": "Student profile not found for this user."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        enrollment = Enrollment.objects.get(student=student, course_id=course_id)
    except Enrollment.DoesNotExist:
        return Response({"detail": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND)

    enrollment.status = Enrollment.Status.DROPPED
    enrollment.save(update_fields=["status"])

    return Response({"detail": "Dropped successfully."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_enrollments(request):
    student = Student.objects.get(user=request.user)
    qs = Enrollment.objects.filter(student=student).select_related("course", "course__instructor")
    return Response(EnrollmentSerializer(qs, many=True).data)

