from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Student


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)

    student_number = serializers.CharField(max_length=20)
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    email = serializers.EmailField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used.")
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used.")
        return value

    def create(self, validated_data):
        username = validated_data["username"]
        password = validated_data["password"]

        user = User.objects.create_user(
            username=username,
            password=password,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        Student.objects.create(
            user=user,
            student_number=validated_data["student_number"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
        )
        return user


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "student_number", "first_name", "last_name", "email"]
