from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, Counselor, Booking, Resource, Feedback, Video, Audio, UserProfile, Student, Session


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'is_counselor')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_counselor', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class UserLoginSerializer(serializers.Serializer):
    """Serializer for OAuth2 login - credentials are handled by OAuth2 provider"""
    username = serializers.CharField()
    password = serializers.CharField()


class CounselorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counselor
        fields = ('id', 'name', 'email', 'specialization', 'created_at')
        read_only_fields = ('id', 'created_at')


class BookingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    counselor_name = serializers.CharField(source='counselor.name', read_only=True)
    counselor_specialization = serializers.CharField(source='counselor.specialization', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'student', 'counselor', 'student_name', 'counselor_name', 
                 'counselor_specialization', 'date', 'time', 'status', 'notes', 
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'student', 'created_at', 'updated_at')

    def validate(self, attrs):
        # Ensure counselor exists
        if attrs.get('counselor'):
            try:
                counselor = Counselor.objects.get(id=attrs['counselor'].id)
            except Counselor.DoesNotExist:
                raise serializers.ValidationError("Counselor does not exist")
        
        return attrs

    def create(self, validated_data):
        # Set the student to the authenticated user
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('id', 'title', 'description', 'url', 'created_at')
        read_only_fields = ('id', 'created_at')


class FeedbackSerializer(serializers.ModelSerializer):
    session_info = serializers.CharField(source='session.scheduled_time', read_only=True)

    class Meta:
        model = Feedback
        fields = ('id', 'session', 'session_info', 'rating', 'comments', 'created_at')
        read_only_fields = ('id', 'created_at')


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id', 'title', 'link', 'thumbnail', 'description', 'duration', 'tags', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = ('id', 'title', 'link', 'thumbnail', 'description', 'duration', 'tags', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'phone_number', 'address', 'emergency_contact', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name', 'enrollment_date', 'counseling_type', 'improvement_score', 
                 'pre_counseling_score', 'post_counseling_score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'improvement_score', 'created_at', 'updated_at')


class SessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    counselor_name = serializers.CharField(source='counselor.name', read_only=True)
    
    class Meta:
        model = Session
        fields = ('id', 'student', 'counselor', 'student_name', 'counselor_name', 
                 'session_type', 'date', 'time', 'improvement_score', 'notes', 
                 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


# Analytics Dashboard Serializers
class MetricsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    avg_improvement = serializers.DecimalField(max_digits=5, decimal_places=2)
    session_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    active_counselors = serializers.IntegerField()


class PerformanceTrendSerializer(serializers.Serializer):
    date = serializers.DateField()
    avg_pre_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    avg_post_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    improvement = serializers.DecimalField(max_digits=5, decimal_places=2)


class SessionImpactSerializer(serializers.Serializer):
    counseling_type = serializers.CharField()
    avg_improvement = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()


class StudentAnalyticsSerializer(serializers.ModelSerializer):
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    avg_improvement = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        model = Student
        fields = ('id', 'name', 'enrollment_date', 'counseling_type', 'improvement_score', 
                 'pre_counseling_score', 'post_counseling_score', 'total_sessions', 
                 'completed_sessions', 'avg_improvement', 'created_at', 'updated_at')
        read_only_fields = ('id', 'improvement_score', 'total_sessions', 'completed_sessions', 
                           'avg_improvement', 'created_at', 'updated_at')


class UpcomingSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    counselor_name = serializers.CharField(source='counselor.name', read_only=True)
    counselor_specialization = serializers.CharField(source='counselor.specialization', read_only=True)
    
    class Meta:
        model = Session
        fields = ('id', 'student', 'counselor', 'student_name', 'counselor_name', 
                 'counselor_specialization', 'session_type', 'date', 'time', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')
