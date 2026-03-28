from django.urls import path
from . import views

urlpatterns = [
path('', views.home, name='home'),
path('signup/', views.signup, name='signup'),

path('students/', views.students_page, name='students'),
path('students/update/<int:pk>/', views.update_student, name='update_student'),
path('students/delete/<int:pk>/', views.delete_student, name='delete_student'),

path('subjects/', views.subjects_page, name='subjects'),
path('subjects/update/<int:pk>/', views.update_subject, name='update_subject'),
path('subjects/delete/<int:pk>/', views.delete_subject, name='delete_subject'),

path('grades/', views.grades_page, name='grades'),
path('grades/update/<int:pk>/', views.update_grade, name='update_grade'),
path('grades/delete/<int:pk>/', views.delete_grade, name='delete_grade'),

path('profile/', views.user_profile, name='user_profile'),
path('contact/', views.contact, name='contact'),
]