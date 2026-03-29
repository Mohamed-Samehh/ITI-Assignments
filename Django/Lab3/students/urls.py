from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .views import (
    GradeViewSet,
    RegisterAPIView,
    SubjectDetailAPIView,
    SubjectListCreateAPIView,
    student_detail_fbv,
    student_list_create_fbv,
)

router = DefaultRouter()
router.register("grades", GradeViewSet, basename="grade")

urlpatterns = [
    path("register", RegisterAPIView.as_view(), name="api_auth_register"),
    path("login", obtain_auth_token, name="api_auth_login"),
    path("students", student_list_create_fbv, name="api_fbv_students_list_create"),
    path("students/<int:pk>", student_detail_fbv, name="api_fbv_students_detail"),
    path("subjects", SubjectListCreateAPIView.as_view(), name="api_cbv_subjects_list_create"),
    path("subjects/<int:pk>", SubjectDetailAPIView.as_view(), name="api_cbv_subjects_detail"),
    path("", include(router.urls)),
]