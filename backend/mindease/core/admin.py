from django.contrib import admin
from .models import User, Counselor, Booking, Resource, Feedback, Video, Audio, UserProfile, Student, Session

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_counselor', 'date_joined')
    list_filter = ('is_counselor', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(Counselor)
class CounselorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'specialization', 'user', 'created_at')
    list_filter = ('specialization', 'created_at')
    search_fields = ('name', 'email', 'specialization')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'counselor', 'date', 'time', 'status', 'created_at')
    list_filter = ('status', 'date', 'counselor', 'created_at')
    search_fields = ('student__username', 'counselor__name', 'notes')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('student', 'counselor')

admin.site.register(Resource)
admin.site.register(Feedback)

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration', 'created_at')
    list_filter = ('created_at', 'tags')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Audio)
class AudioAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration', 'created_at')
    list_filter = ('created_at', 'tags')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email', 'phone_number')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'counseling_type', 'improvement_score', 'enrollment_date')
    list_filter = ('counseling_type', 'enrollment_date', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('improvement_score', 'created_at', 'updated_at')

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'counselor', 'session_type', 'date', 'time', 'status')
    list_filter = ('session_type', 'status', 'date', 'created_at')
    search_fields = ('student__name', 'counselor__name', 'notes')
    readonly_fields = ('created_at', 'updated_at')
