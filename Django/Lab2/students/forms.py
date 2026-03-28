from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

from .models import Feedback, Grade, Student, Subject


class SignupForm(UserCreationForm):
	use_required_attribute = False
	email = forms.EmailField(required=True)

	class Meta:
		model = User
		fields = ("username", "email", "password1", "password2")


class StudentForm(forms.ModelForm):
	use_required_attribute = False

	class Meta:
		model = Student
		fields = ["name", "age", "email", "image"]

	def clean_age(self):
		age = self.cleaned_data["age"]
		if age <= 0:
			raise forms.ValidationError("Age must be greater than 0.")
		return age


class SubjectForm(forms.ModelForm):
	use_required_attribute = False

	class Meta:
		model = Subject
		fields = ["name", "code"]


class GradeForm(forms.ModelForm):
	use_required_attribute = False

	class Meta:
		model = Grade
		fields = ["student", "subject", "score"]

	def clean_score(self):
		score = self.cleaned_data["score"]
		if score < 0 or score > 100:
			raise forms.ValidationError("Score must be between 0 and 100.")
		return score


class FeedbackForm(forms.ModelForm):
	use_required_attribute = False

	class Meta:
		model = Feedback
		fields = ["email", "message", "date_added"]
		widgets = {
			"date_added": forms.DateInput(attrs={"type": "date"}),
		}


class NoRequiredAuthenticationForm(AuthenticationForm):
	use_required_attribute = False