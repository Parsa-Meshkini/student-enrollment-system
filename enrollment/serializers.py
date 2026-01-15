from rest_framework import serializers
from .models import Student, Instructor, Course, Enrollment


class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ["id", "employee_id", "name", "email"]


class CourseSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ["id", "code", "title", "credits", "capacity", "instructor", "enrolled_count"]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course", "status", "enrolled_at"]


class EnrollActionSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
