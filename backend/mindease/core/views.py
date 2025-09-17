from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from django.contrib.auth import authenticate
from django.contrib.auth.models import User as DjangoUser
from django.core.exceptions import ValidationError
from django.db import models
from .models import User, Counselor, Booking, Resource, Feedback, Video, Audio, UserProfile, Student, Session
from .serializers import (
    UserRegistrationSerializer, UserSerializer, UserLoginSerializer,
    CounselorSerializer, BookingSerializer, ResourceSerializer, FeedbackSerializer,
    VideoSerializer, AudioSerializer, UserProfileSerializer, StudentSerializer, SessionSerializer,
    MetricsSerializer, PerformanceTrendSerializer, SessionImpactSerializer, 
    StudentAnalyticsSerializer, UpcomingSessionSerializer
)
from .permissions import IsCounselor, IsStudent, IsStudentOrCounselor
import os
import json
from urllib import request as urlrequest
from urllib import parse as urlparse
from urllib.error import HTTPError, URLError


# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User created successfully. Please login to get access token.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def email_login_view(request):
    """Login with email and password, returning OAuth2 tokens."""
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'error': 'email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        return Response({'error': 'User is inactive'}, status=status.HTTP_403_FORBIDDEN)

    client_id = os.environ.get('OAUTH_CLIENT_ID')
    client_secret = os.environ.get('OAUTH_CLIENT_SECRET')
    if not client_id or not client_secret:
        return Response({'error': 'Server OAuth client not configured', 'details': 'Missing OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    payload = {
        'grant_type': 'password',
        'username': user.username,
        'password': password,
        'client_id': client_id,
        'client_secret': client_secret,
    }

    token_url = request.build_absolute_uri('/o/token/')
    data = urlparse.urlencode(payload).encode('utf-8')
    req = urlrequest.Request(token_url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    try:
        with urlrequest.urlopen(req) as resp:
            resp_body = resp.read().decode('utf-8')
            try:
                json_body = json.loads(resp_body)
            except json.JSONDecodeError:
                json_body = {'raw': resp_body}
            return Response(json_body, status=resp.getcode())
    except HTTPError as ex:
        err_body = ex.read().decode('utf-8') if hasattr(ex, 'read') else ''
        try:
            json_body = json.loads(err_body) if err_body else {'error': str(ex)}
        except json.JSONDecodeError:
            json_body = {'error': str(ex), 'raw': err_body}
        return Response(json_body, status=ex.code or status.HTTP_400_BAD_REQUEST)
    except URLError as ex:
        return Response({'error': 'Token endpoint unreachable', 'details': str(ex.reason)}, status=status.HTTP_502_BAD_GATEWAY)
    except Exception as ex:
        return Response({'error': 'Login failed', 'details': str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_view(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile_view(request):
    """Update current user profile"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Counselor APIs
class CounselorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing counselors.
    Only allows read operations (GET).
    """
    queryset = Counselor.objects.all()
    serializer_class = CounselorSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    
    def get_queryset(self):
        return Counselor.objects.all()


# Booking APIs
class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing bookings.
    Students can create/view their own bookings.
    Counselors can view/manage bookings assigned to them.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]

    def get_queryset(self):
        user = self.request.user
        if user.is_counselor:
            # Counselors see bookings assigned to them
            try:
                counselor = user.counselor_profile
                return Booking.objects.filter(counselor=counselor)
            except Counselor.DoesNotExist:
                return Booking.objects.none()
        else:
            # Students see their own bookings
            return Booking.objects.filter(student=user)

    def perform_create(self, serializer):
        # Ensure only students can create bookings
        if self.request.user.is_counselor:
            raise ValidationError("Counselors cannot create bookings")
        serializer.save(student=self.request.user)

    def perform_update(self, serializer):
        # Only allow owner or counselor to update
        booking = self.get_object()
        user = self.request.user
        
        if user.is_counselor:
            # Counselors can update status and notes
            allowed_fields = ['status', 'notes']
            for field in allowed_fields:
                if field in serializer.validated_data:
                    setattr(booking, field, serializer.validated_data[field])
            booking.save()
        else:
            # Students can update their own bookings (limited fields)
            if booking.student != user:
                raise ValidationError("You can only update your own bookings")
            # Students can only update notes and cancel bookings
            if 'status' in serializer.validated_data:
                if serializer.validated_data['status'] not in ['cancelled']:
                    raise ValidationError("Students can only cancel bookings")
            serializer.save()

    def perform_destroy(self, instance):
        # Only allow owner to delete/cancel
        if instance.student != self.request.user:
            raise ValidationError("You can only delete your own bookings")
        instance.delete()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        if booking.student != request.user:
            return Response(
                {'error': 'You can only cancel your own bookings'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking (counselor only)"""
        booking = self.get_object()
        if not request.user.is_counselor:
            return Response(
                {'error': 'Only counselors can confirm bookings'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'confirmed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)


# Resource APIs
class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]


# Feedback APIs
class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]

    def get_queryset(self):
        user = self.request.user
        if user.is_counselor:
            return Feedback.objects.filter(session__counselor=user)
        else:
            return Feedback.objects.filter(session__student=user)


# Counselor Management Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, TokenHasScope])
def counselor_list_view(request):
    """Get list of all counselors"""
    counselors = User.objects.filter(is_counselor=True)
    serializer = UserSerializer(counselors, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, TokenHasScope])
def student_list_view(request):
    """Get list of all students (for counselors)"""
    if not request.user.is_counselor:
        return Response({'error': 'Only counselors can view student list'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    students = User.objects.filter(is_counselor=False)
    serializer = UserSerializer(students, many=True)
    return Response(serializer.data)


# Video APIs
class VideoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing videos.
    Allows CRUD operations for video content.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    
    def get_queryset(self):
        # Allow filtering by tags
        tags = self.request.query_params.get('tags', None)
        queryset = Video.objects.all()
        
        if tags:
            # Filter by tags (comma-separated)
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__overlap=tag_list)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search videos by title or description"""
        query = request.query_params.get('q', '')
        if query:
            videos = Video.objects.filter(
                models.Q(title__icontains=query) | 
                models.Q(description__icontains=query)
            )
            serializer = self.get_serializer(videos, many=True)
            return Response(serializer.data)
        return Response([])


# Audio APIs
class AudioViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing audio content.
    Allows CRUD operations for audio content.
    """
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    
    def get_queryset(self):
        # Allow filtering by tags
        tags = self.request.query_params.get('tags', None)
        queryset = Audio.objects.all()
        
        if tags:
            # Filter by tags (comma-separated)
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__overlap=tag_list)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search audio by title or description"""
        query = request.query_params.get('q', '')
        if query:
            audios = Audio.objects.filter(
                models.Q(title__icontains=query) | 
                models.Q(description__icontains=query)
            )
            serializer = self.get_serializer(audios, many=True)
            return Response(serializer.data)
        return Response([])


# Analytics Dashboard Views (Counselor Only)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCounselor])
def metrics_view(request):
    """Get key metrics for analytics dashboard"""
    from django.db.models import Avg, Count
    from datetime import datetime, timedelta
    
    # Calculate metrics
    total_students = Student.objects.count()
    
    # Average improvement score
    avg_improvement = Student.objects.aggregate(
        avg_improvement=Avg('improvement_score')
    )['avg_improvement'] or 0
    
    # Session completion percentage
    total_sessions = Session.objects.count()
    completed_sessions = Session.objects.filter(status='completed').count()
    session_completion_percentage = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
    
    # Active counselors (counselors with sessions in last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    active_counselors = Counselor.objects.filter(
        sessions__date__gte=thirty_days_ago
    ).distinct().count()
    
    metrics_data = {
        'total_students': total_students,
        'avg_improvement': round(avg_improvement, 2),
        'session_completion_percentage': round(session_completion_percentage, 2),
        'active_counselors': active_counselors
    }
    
    serializer = MetricsSerializer(metrics_data)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCounselor])
def performance_trends_view(request):
    """Get performance trends over time"""
    from django.db.models import Avg
    from datetime import datetime, timedelta
    
    # Get last 12 months of data
    twelve_months_ago = datetime.now() - timedelta(days=365)
    
    # Group sessions by month and calculate averages
    trends_data = []
    for i in range(12):
        month_start = twelve_months_ago + timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        
        sessions_in_month = Session.objects.filter(
            date__gte=month_start,
            date__lt=month_end,
            status='completed'
        )
        
        if sessions_in_month.exists():
            avg_pre = sessions_in_month.aggregate(
                avg_pre=Avg('student__pre_counseling_score')
            )['avg_pre'] or 0
            
            avg_post = sessions_in_month.aggregate(
                avg_post=Avg('student__post_counseling_score')
            )['avg_post'] or 0
            
            improvement = avg_post - avg_pre
            
            trends_data.append({
                'date': month_start.date(),
                'avg_pre_score': round(avg_pre, 2),
                'avg_post_score': round(avg_post, 2),
                'improvement': round(improvement, 2)
            })
    
    serializer = PerformanceTrendSerializer(trends_data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCounselor])
def session_impact_view(request):
    """Get improvement scores grouped by counseling type"""
    from django.db.models import Avg, Count
    
    counseling_types = ['academic', 'emotional', 'career', 'social']
    impact_data = []
    
    for counseling_type in counseling_types:
        sessions = Session.objects.filter(
            student__counseling_type=counseling_type,
            status='completed'
        )
        
        if sessions.exists():
            avg_improvement = sessions.aggregate(
                avg_improvement=Avg('student__improvement_score')
            )['avg_improvement'] or 0
            
            total_sessions = sessions.count()
            completed_sessions = sessions.filter(status='completed').count()
            
            impact_data.append({
                'counseling_type': counseling_type.title(),
                'avg_improvement': round(avg_improvement, 2),
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions
            })
    
    serializer = SessionImpactSerializer(impact_data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCounselor])
def students_analytics_view(request):
    """Get list of students with improvement data"""
    from django.db.models import Count, Avg
    
    students = Student.objects.annotate(
        total_sessions=Count('sessions'),
        completed_sessions=Count('sessions', filter=models.Q(sessions__status='completed')),
        avg_improvement=Avg('sessions__improvement_score')
    ).order_by('-improvement_score')
    
    serializer = StudentAnalyticsSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCounselor])
def upcoming_sessions_view(request):
    """Get list of upcoming counseling sessions"""
    from datetime import datetime, timedelta
    
    # Get sessions for next 30 days
    today = datetime.now().date()
    thirty_days_later = today + timedelta(days=30)
    
    upcoming_sessions = Session.objects.filter(
        date__gte=today,
        date__lte=thirty_days_later,
        status='scheduled'
    ).order_by('date', 'time')
    
    serializer = UpcomingSessionSerializer(upcoming_sessions, many=True)
    return Response(serializer.data)


# Student and Session Management Views
class StudentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing students"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCounselor]
    
    def get_queryset(self):
        return Student.objects.all().order_by('-created_at')


class SessionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing counseling sessions"""
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCounselor]
    
    def get_queryset(self):
        return Session.objects.all().order_by('-date', '-time')
    
    def perform_create(self, serializer):
        # Automatically calculate improvement score if pre/post scores are provided
        student = serializer.validated_data['student']
        if student.pre_counseling_score and student.post_counseling_score:
            student.calculate_improvement_score()
        serializer.save()
