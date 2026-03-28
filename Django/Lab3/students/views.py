from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from .models import Student, Subject, Grade, Feedback
from .forms import FeedbackForm, GradeForm, SignupForm, StudentForm, SubjectForm


def signup(request):
	if request.method == 'POST':
		form = SignupForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('login')
	else:
		form = SignupForm()

	return render(request, 'registration/signup.html', {'form': form})

@login_required
def home(request):
	return render(request, 'students/home.html')

@login_required
def user_profile(request):
	return render(request, 'students/user_profile.html')

@login_required
def students_page(request):
	query = request.GET.get('q', '')
	students = Student.objects.all()
	if query:
		students = students.filter(
			Q(name__icontains=query) |
			Q(email__icontains=query)
		)

	if request.method == 'POST':
		form = StudentForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			return redirect('students')
	else:
		form = StudentForm()

	context = {'students': students, 'query': query, 'form': form}
	return render(request, 'students/students.html', context)

@login_required
def update_student(request, pk):
	student = get_object_or_404(Student, pk=pk)

	if request.method == 'POST':
		form = StudentForm(request.POST, request.FILES, instance=student)
		if form.is_valid():
			form.save()
			return redirect('students')
	else:
		form = StudentForm(instance=student)

	return render(request, 'students/student_form.html', {'form': form, 'title': 'Update Student'})

@login_required
def delete_student(request, pk):
	student = get_object_or_404(Student, pk=pk)
	if request.method == 'POST':
		student.delete()
		return redirect('students')
	return render(request, 'students/confirm_delete.html', {'object': student, 'type': 'Student'})

@login_required
def subjects_page(request):
	query = request.GET.get('q', '')
	subjects = Subject.objects.all()
	if query:
		subjects = subjects.filter(
			Q(name__icontains=query) |
			Q(code__icontains=query)
		)

	if request.method == 'POST':
		form = SubjectForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('subjects')
	else:
		form = SubjectForm()

	context = {'subjects': subjects, 'query': query, 'form': form}
	return render(request, 'students/subjects.html', context)

@login_required
def update_subject(request, pk):
	subject = get_object_or_404(Subject, pk=pk)

	if request.method == 'POST':
		form = SubjectForm(request.POST, instance=subject)
		if form.is_valid():
			form.save()
			return redirect('subjects')
	else:
		form = SubjectForm(instance=subject)

	return render(request, 'students/subject_form.html', {'form': form, 'title': 'Update Subject'})

@login_required
def delete_subject(request, pk):
	subject = get_object_or_404(Subject, pk=pk)
	if request.method == 'POST':
		subject.delete()
		return redirect('subjects')
	return render(request, 'students/confirm_delete.html', {'object': subject, 'type': 'Subject'})

@login_required
def grades_page(request):
	query = request.GET.get('q', '')
	grades = Grade.objects.select_related('student', 'subject').all()

	if query:
		grades = grades.filter(
			Q(student__id__icontains=query) |
			Q(subject__name__icontains=query)
		)

	if request.method == 'POST':
		form = GradeForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('grades')
	else:
		form = GradeForm()

	context = {
		'grades': grades,
		'query': query,
		'form': form,
	}
	return render(request, 'students/grades.html', context)

@login_required
def update_grade(request, pk):
	grade = get_object_or_404(Grade, pk=pk)

	if request.method == 'POST':
		form = GradeForm(request.POST, instance=grade)
		if form.is_valid():
			form.save()
			return redirect('grades')
	else:
		form = GradeForm(instance=grade)

	return render(
		request,
		'students/grade_form.html',
		{
			'form': form,
			'title': 'Update Grade',
		},
	)

@login_required
def delete_grade(request, pk):
	grade = get_object_or_404(Grade, pk=pk)
	if request.method == 'POST':
		grade.delete()
		return redirect('grades')
	return render(request, 'students/confirm_delete.html', {'object': grade, 'type': 'Grade'})

@login_required
def contact(request):
	if request.method == 'POST':
		form = FeedbackForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('contact')
	else:
		form = FeedbackForm()

	return render(request, 'students/contact.html', {'form': form})