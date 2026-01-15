from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile", null=True, blank=True)
    student_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)

    def __str__(self) -> str:
        return f"{self.student_number} - {self.first_name} {self.last_name}"



class Instructor(models.Model):
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)

    def __str__(self) -> str:
        return f"{self.employee_id} - {self.name}"


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    credits = models.PositiveSmallIntegerField(default=3, validators=[MinValueValidator(1)])
    capacity = models.PositiveIntegerField(default=30)

    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
    )

    students = models.ManyToManyField(Student, through="Enrollment", related_name="courses")

    def __str__(self) -> str:
        return f"{self.code} - {self.title}"


class Enrollment(models.Model):
    class Status(models.TextChoices):
        ENROLLED = "ENROLLED", "Enrolled"
        WAITLISTED = "WAITLISTED", "Waitlisted"
        DROPPED = "DROPPED", "Dropped"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ENROLLED)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["student", "course"], name="unique_student_course")
        ]
        indexes = [
            models.Index(fields=["student"]),
            models.Index(fields=["course"]),
            models.Index(fields=["status"]),
        ]


    def __str__(self) -> str:
        return f"{self.student_id} -> {self.course_id} ({self.status})"
