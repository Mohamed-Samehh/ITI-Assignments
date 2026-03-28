from django.db import models

class Student(models.Model):
	name = models.CharField(max_length=100)
	age = models.IntegerField()
	email = models.EmailField(unique=True)
	image = models.ImageField(upload_to='students/', blank=True, null=True)

	def __str__(self):
		return f"{self.id} - {self.name}"
	
class Subject(models.Model):
	name = models.CharField(max_length=100)
	code = models.CharField(max_length=20, unique=True)

	def __str__(self):
		return f"{self.code} - {self.name}"
	
class Grade(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
	subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grades')
	score = models.DecimalField(max_digits=5, decimal_places=2)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('student', 'subject')

	def __str__(self):
		return f"{self.student.name} | {self.subject.name} | {self.score}"
	
class Feedback(models.Model):
	email = models.EmailField()
	message = models.TextField()
	date_added = models.DateField()

	def __str__(self):
		return self.email