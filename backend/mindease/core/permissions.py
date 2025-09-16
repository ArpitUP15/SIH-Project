from rest_framework import permissions


class IsCounselor(permissions.BasePermission):
    """
    Custom permission to only allow counselors to access analytics dashboard.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user is a counselor
        return request.user.is_counselor and request.user.role == 'counselor'


class IsStudent(permissions.BasePermission):
    """
    Custom permission to only allow students to access student-specific endpoints.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user is a student
        return request.user.role == 'student'


class IsStudentOrCounselor(permissions.BasePermission):
    """
    Custom permission to allow both students and counselors to access certain endpoints.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Allow both students and counselors
        return request.user.role in ['student', 'counselor']
