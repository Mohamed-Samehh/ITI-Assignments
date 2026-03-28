from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('students/', views.students_page, name='students'),
    path('delete/<int:pk>/', views.delete_student, name='delete_student'),
    path('contact/', views.contact, name='contact'),
]