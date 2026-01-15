from django.contrib import admin
from .models import Student, Instructor, Course, Enrollment


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_number", "first_name", "last_name", "email")
    search_fields = ("student_number", "first_name", "last_name", "email")


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "name", "email")
    search_fields = ("employee_id", "name", "email")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "credits", "capacity", "instructor")
    search_fields = ("code", "title")
    list_filter = ("credits",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "status", "enrolled_at")
    search_fields = ("student__student_number", "course__code")
    list_filter = ("status", "course")
