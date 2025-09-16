from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'counselors', views.CounselorViewSet, basename='counselor')
router.register(r'bookings', views.BookingViewSet, basename='booking')
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'audios', views.AudioViewSet, basename='audio')
router.register(r'students', views.StudentViewSet, basename='student')
router.register(r'sessions', views.SessionViewSet, basename='session')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register_view, name='register'),
    path('auth/profile/', views.user_profile_view, name='user-profile'),
    path('auth/profile/update/', views.update_profile_view, name='update-profile'),
    
    # User management endpoints
    path('students/', views.student_list_view, name='student-list'),
    
    # Booking system endpoints (using router)
    path('', include(router.urls)),
    
    # Resource endpoints
    path('resources/', views.ResourceListCreateView.as_view(), name='resource-list'),
    
    # Feedback endpoints
    path('feedbacks/', views.FeedbackListCreateView.as_view(), name='feedback-list'),
    
    # Analytics Dashboard endpoints (Counselor only)
    path('metrics/', views.metrics_view, name='metrics'),
    path('performance-trends/', views.performance_trends_view, name='performance-trends'),
    path('session-impact/', views.session_impact_view, name='session-impact'),
    path('students/', views.students_analytics_view, name='students-analytics'),
    path('sessions/upcoming/', views.upcoming_sessions_view, name='upcoming-sessions'),
]
