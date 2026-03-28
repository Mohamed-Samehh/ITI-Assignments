from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from decimal import Decimal, InvalidOperation
from django.db import IntegrityError
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from .models import Student, Subject, Grade, Feedback


def signup(request):
	error = None

	if request.method == 'POST':
		username = request.POST.get('username', '').strip()
		email = request.POST.get('email', '').strip()
		password1 = request.POST.get('password1', '')
		password2 = request.POST.get('password2', '')

		if not username or not email or not password1 or not password2:
			error = 'All fields are required.'
		elif password1 != password2:
			error = 'Passwords do not match.'
		else:
			try:
				User.objects.create_user(username=username, email=email, password=password1)
				return redirect('login')
			except IntegrityError:
				error = 'Username already exists. Please choose another one.'

	return render(request, 'registration/signup.html', {'error': error})

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

	error = None
	if request.method == 'POST':
		name = request.POST.get('name', '').strip()
		age = request.POST.get('age', '').strip()
		email = request.POST.get('email', '').strip()
		image = request.FILES.get('image')

		if not name or not age or not email:
			error = 'Name, age, and email are required.'
		else:
			try:
				age_value = int(age)
				if age_value <= 0:
					error = 'Age must be greater than 0.'
				else:
					Student.objects.create(name=name, age=age_value, email=email, image=image)
					return redirect('students')
			except ValueError:
				error = 'Age must be a valid number.'
			except IntegrityError:
				error = 'This email already exists. Use a different email.'

	context = {'students': students, 'query': query, 'error': error}
	return render(request, 'students/students.html', context)

@login_required
def update_student(request, pk):
	student = get_object_or_404(Student, pk=pk)
	error = None

	if request.method == 'POST':
		name = request.POST.get('name', '').strip()
		age = request.POST.get('age', '').strip()
		email = request.POST.get('email', '').strip()
		image = request.FILES.get('image')

		if not name or not age or not email:
			error = 'Name, age, and email are required.'
		else:
			try:
				age_value = int(age)
				if age_value <= 0:
					error = 'Age must be greater than 0.'
				else:
					student.name = name
					student.age = age_value
					student.email = email
					if image:
						student.image = image
					student.save()
					return redirect('students')
			except ValueError:
				error = 'Age must be a valid number.'
			except IntegrityError:
				error = 'This email already exists. Use a different email.'

	return render(request, 'students/student_form.html', {'student': student, 'title': 'Update Student', 'error': error})

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

	error = None
	if request.method == 'POST':
		name = request.POST.get('name', '').strip()
		code = request.POST.get('code', '').strip()
		if not name or not code:
			error = 'Subject name and code are required.'
		else:
			try:
				Subject.objects.create(name=name, code=code)
				return redirect('subjects')
			except IntegrityError:
				error = 'This subject code already exists.'

	context = {'subjects': subjects, 'query': query, 'error': error}
	return render(request, 'students/subjects.html', context)

@login_required
def update_subject(request, pk):
	subject = get_object_or_404(Subject, pk=pk)
	error = None

	if request.method == 'POST':
		name = request.POST.get('name', '').strip()
		code = request.POST.get('code', '').strip()
		if not name or not code:
			error = 'Subject name and code are required.'
		else:
			try:
				subject.name = name
				subject.code = code
				subject.save()
				return redirect('subjects')
			except IntegrityError:
				error = 'This subject code already exists.'

	return render(request, 'students/subject_form.html', {'subject': subject, 'title': 'Update Subject', 'error': error})

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
	students_list = Student.objects.all().order_by('name')
	subjects_list = Subject.objects.all().order_by('name')

	if query:
		grades = grades.filter(
			Q(student__id__icontains=query) |
			Q(subject__name__icontains=query)
		)

	error = None
	if request.method == 'POST':
		student_id = request.POST.get('student', '').strip()
		subject_id = request.POST.get('subject', '').strip()
		score = request.POST.get('score', '').strip()

		student = Student.objects.filter(pk=int(student_id)).first() if student_id.isdigit() else None
		subject = Subject.objects.filter(pk=int(subject_id)).first() if subject_id.isdigit() else None

		if not student or not subject or not score:
			error = 'Student, subject, and score are required.'
		else:
			try:
				score_value = Decimal(score)
				Grade.objects.create(student=student, subject=subject, score=score_value)
				return redirect('grades')
			except InvalidOperation:
				error = 'Score must be a valid number.'
			except IntegrityError:
				error = 'This student already has a grade for this subject.'

	context = {
		'grades': grades,
		'students_list': students_list,
		'subjects_list': subjects_list,
		'query': query,
		'error': error,
	}
	return render(request, 'students/grades.html', context)

@login_required
def update_grade(request, pk):
	grade = get_object_or_404(Grade, pk=pk)
	students_list = Student.objects.all().order_by('name')
	subjects_list = Subject.objects.all().order_by('name')
	error = None

	if request.method == 'POST':
		student_id = request.POST.get('student', '').strip()
		subject_id = request.POST.get('subject', '').strip()
		score = request.POST.get('score', '').strip()

		student = Student.objects.filter(pk=int(student_id)).first() if student_id.isdigit() else None
		subject = Subject.objects.filter(pk=int(subject_id)).first() if subject_id.isdigit() else None

		if not student or not subject or not score:
			error = 'Student, subject, and score are required.'
		else:
			try:
				score_value = Decimal(score)
				grade.student = student
				grade.subject = subject
				grade.score = score_value
				grade.save()
				return redirect('grades')
			except InvalidOperation:
				error = 'Score must be a valid number.'
			except IntegrityError:
				error = 'This student already has a grade for this subject.'

	return render(
		request,
		'students/grade_form.html',
		{
			'grade': grade,
			'students_list': students_list,
			'subjects_list': subjects_list,
			'title': 'Update Grade',
			'error': error,
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
	error = None

	if request.method == 'POST':
		email = request.POST.get('email', '').strip()
		message = request.POST.get('message', '').strip()
		date_added = request.POST.get('date_added', '').strip()

		if not email or not message or not date_added:
			error = 'Email, message, and date are required.'
		else:
			Feedback.objects.create(email=email, message=message, date_added=date_added)
			return redirect('contact')

	return render(request, 'students/contact.html', {'error': error})