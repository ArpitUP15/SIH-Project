from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

# 1. User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('counselor', 'Counselor'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_counselor = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        # Automatically set is_counselor based on role
        self.is_counselor = (self.role == 'counselor')
        super().save(*args, **kwargs) 

# 2. Counselor Model
class Counselor(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    specialization = models.CharField(max_length=200)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='counselor_profile')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

# 3. Booking Model (renamed from Session)
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed')
    ]
    
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, related_name='student_bookings', on_delete=models.CASCADE)
    counselor = models.ForeignKey(Counselor, related_name='counselor_bookings', on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.username} - {self.counselor.name} ({self.date} {self.time})"
    
    def clean(self):
        # Prevent double booking
        if self.pk:  # If updating existing booking
            existing_bookings = Booking.objects.filter(
                counselor=self.counselor,
                date=self.date,
                time=self.time,
                status__in=['pending', 'confirmed']
            ).exclude(pk=self.pk)
        else:  # If creating new booking
            existing_bookings = Booking.objects.filter(
                counselor=self.counselor,
                date=self.date,
                time=self.time,
                status__in=['pending', 'confirmed']
            )
        
        if existing_bookings.exists():
            raise ValidationError(
                f"Counselor {self.counselor.name} is already booked at {self.time} on {self.date}"
            )
        
        # Prevent booking in the past
        booking_datetime = timezone.datetime.combine(self.date, self.time)
        if booking_datetime < timezone.now():
            raise ValidationError("Cannot book appointments in the past")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['counselor', 'date', 'time']

# 3. Resource Model (optional)
class Resource(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

# 4. Feedback Model (optional)
class Feedback(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)
    comments = models.TextField(blank=True, null=True)

# 5. Video Model
class Video(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    link = models.URLField()
    thumbnail = models.URLField()
    description = models.TextField()
    duration = models.CharField(max_length=10)  # Format: "04:07"
    tags = models.JSONField(default=list)  # Store as list of strings
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


# 7. UserProfile Model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} Profile"

# 8. Student Model
class Student(models.Model):
    COUNSELING_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('emotional', 'Emotional'),
        ('career', 'Career'),
        ('social', 'Social'),
    ]
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    enrollment_date = models.DateField()
    counseling_type = models.CharField(max_length=20, choices=COUNSELING_TYPE_CHOICES)
    improvement_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    pre_counseling_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    post_counseling_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def calculate_improvement_score(self):
        """Calculate improvement score based on pre and post counseling scores"""
        if self.pre_counseling_score and self.post_counseling_score:
            self.improvement_score = self.post_counseling_score - self.pre_counseling_score
            self.save()
        return self.improvement_score
    
    class Meta:
        ordering = ['-created_at']

# 9. Session Model (for counseling sessions)
class Session(models.Model):
    SESSION_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('emotional', 'Emotional'),
        ('career', 'Career'),
        ('social', 'Social'),
    ]
    
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='sessions')
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name='sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES)
    date = models.DateField()
    time = models.TimeField()
    improvement_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.name} - {self.counselor.name} ({self.date})"
    
    class Meta:
        ordering = ['-date', '-time']

# 6. Audio Model
class Audio(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    link = models.URLField()
    thumbnail = models.URLField(blank=True, null=True)  # Audio might not have thumbnails
    description = models.TextField()
    duration = models.CharField(max_length=10)  # Format: "04:07"
    tags = models.JSONField(default=list)  # Store as list of strings
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']