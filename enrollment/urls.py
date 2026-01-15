from django.urls import path
from . import views, auth_views, password_reset_views

urlpatterns = [
    path("auth/register/", auth_views.register),
    path("me/", auth_views.me),
    path("courses/", views.course_list),
    path("students/<int:student_id>/enrollments/", views.student_enrollments),
    path("enroll/", views.enroll),
    path("drop/", views.drop),
    path("my/enrollments/", views.my_enrollments),
    path("auth/password-reset/", password_reset_views.password_reset_request),
    path("auth/password-reset/confirm/", password_reset_views.password_reset_confirm),
]
