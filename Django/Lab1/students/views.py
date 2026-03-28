from django.shortcuts import render, redirect, get_object_or_404
from .models import Student, Feedback
from .forms import StudentForm, FeedbackForm

def home(request):
    return render(request, 'students/home.html')

def students_page(request):
    form = StudentForm()

    if request.method == 'POST':
        form = StudentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('students')

    all_students = Student.objects.all()
    return render(request, 'students/students.html', {'form': form, 'students': all_students})

def delete_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    student.delete()
    return redirect('students')

def contact(request):
    form = FeedbackForm()

    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact')

    return render(request, 'students/contact.html', {'form': form})