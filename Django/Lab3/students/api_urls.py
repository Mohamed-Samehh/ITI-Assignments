from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api_views import (
    GradeViewSet,
    SubjectDetailAPIView,
    SubjectListCreateAPIView,
    student_detail_fbv,
    student_list_create_fbv,
)

router = DefaultRouter()
router.register("grades", GradeViewSet, basename="grade")

urlpatterns = [
    # Function-based views
    path("fbv/students/", student_list_create_fbv, name="api_fbv_students_list_create"),
    path("fbv/students/<int:pk>/", student_detail_fbv, name="api_fbv_students_detail"),

    # Class-based views
    path("cbv/subjects/", SubjectListCreateAPIView.as_view(), name="api_cbv_subjects_list_create"),
    path("cbv/subjects/<int:pk>/", SubjectDetailAPIView.as_view(), name="api_cbv_subjects_detail"),

    # ViewSet routes
    path("viewsets/", include(router.urls)),
]
