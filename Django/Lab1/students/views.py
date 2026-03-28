from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render

from .models import Feedback, Student


@login_required
def home(request):
    return render(request, 'students/home.html')


@login_required
def students_page(request):
    query = request.GET.get('q', '').strip()
    students = Student.objects.all()
    if query:
        students = students.filter(
            Q(name__icontains=query) |
            Q(email__icontains=query)
        )

    error = None
    form_data = {'name': '', 'age': '', 'email': ''}
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        age = request.POST.get('age', '').strip()
        email = request.POST.get('email', '').strip()
        image = request.FILES.get('image')
        form_data = {'name': name, 'age': age, 'email': email}

        if not name or not age or not email or not image:
            error = 'Name, age, email, and image are required.'
        else:
            try:
                age_value = int(age)
                if age_value <= 0:
                    error = 'Age must be greater than 0.'
                else:
                    Student.objects.create(
                        name=name,
                        age=age_value,
                        email=email,
                        image=image,
                    )
                    return redirect('students')
            except ValueError:
                error = 'Age must be a valid number.'
            except IntegrityError:
                error = 'This email already exists. Use a different email.'

    context = {
        'students': students,
        'query': query,
        'error': error,
        'form_data': form_data,
    }
    return render(request, 'students/students.html', context)


@login_required
def delete_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.delete()
    return redirect('students')


@login_required
def contact(request):
    error = None
    form_data = {'email': '', 'message': '', 'date_added': ''}
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        message = request.POST.get('message', '').strip()
        date_added = request.POST.get('date_added', '').strip()
        form_data = {'email': email, 'message': message, 'date_added': date_added}

        if not email or not message or not date_added:
            error = 'Email, message, and date are required.'
        else:
            try:
                date_value = datetime.strptime(date_added, '%Y-%m-%d').date()
                Feedback.objects.create(
                    email=email,
                    message=message,
                    date_added=date_value,
                )
                return redirect('contact')
            except ValueError:
                error = 'Date must be in YYYY-MM-DD format.'
            except IntegrityError:
                error = 'Could not save feedback. Please try again.'

    return render(request, 'students/contact.html', {'error': error, 'form_data': form_data})