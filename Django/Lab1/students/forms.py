from django import forms
from .models import Student, Feedback

class StudentForm(forms.ModelForm):
    use_required_attribute = False

    class Meta:
        model = Student
        fields = ['name', 'age', 'email', 'image']


class FeedbackForm(forms.ModelForm):
    use_required_attribute = False

    class Meta:
        model = Feedback
        fields = ['email', 'message', 'date_added']
        widgets = {
            'date_added': forms.DateInput(attrs={'type': 'date'}),
        }