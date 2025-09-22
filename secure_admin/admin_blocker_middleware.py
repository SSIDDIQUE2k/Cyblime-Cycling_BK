"""
Django Admin Blocker Middleware
Completely hides Django admin from public access
"""
import logging
from django.http import Http404
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import redirect

logger = logging.getLogger(__name__)

class AdminBlockerMiddleware(MiddlewareMixin):
    """
    Middleware to completely block access to Django admin URLs
    Returns 404 for any admin URL access attempts
    """
    
    def process_request(self, request):
        # Secure admin access - Only allow authenticated admin/staff users
        
        # Allow emergency admin access through secure portal
        allowed_admin_paths = [
            '/secure-admin-portal/emergency-django-admin/',
        ]

        # Allow unauthenticated access for admin login-related endpoints only
        allowed_admin_login_paths = [
            '/admin/admindashboard/login/',
            '/admin/admindashboard/logout/',
            '/admin/admindashboard/password_change/',
            '/admin/admindashboard/password_change/done/',
            '/admin/admindashboard/jsi18n/',
            # Generic admin fallbacks (if Django uses them internally)
            '/admin/login/',
            '/admin/logout/',
            '/admin/password_change/',
            '/admin/password_change/done/',
            '/admin/jsi18n/',
        ]
        
        # Don't block allowed admin paths
        for allowed_path in allowed_admin_paths + allowed_admin_login_paths:
            if request.path.startswith(allowed_path):
                return None
        
        # Define Django admin URLs to check
        admin_paths = [
            '/admin/',
            '/admin',
            '/admin/admindashboard/',
            '/admin/admindashboard',
            '/hidden-backend-admin/',  # Keep for backward compatibility
            '/hidden-backend-admin',
        ]
        
        # Check if the request path starts with any admin path
        for admin_path in admin_paths:
            if request.path.startswith(admin_path):
                # Allow access if user is authenticated and is admin/superuser
                if hasattr(request, 'user') and request.user.is_authenticated:
                    if request.user.is_superuser or request.user.is_staff:
                        # Log successful admin access
                        logger.info(f"Admin access granted for user: {request.user.username}, Path: {request.path}")
                        return None  # Allow access
                    else:
                        # Authenticated but not admin/staff -> 404
                        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                        ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
                        logger.warning(f"Blocked non-admin authenticated access from IP: {ip}, User: {request.user.username}, Path: {request.path}")
                        raise Http404("Page not found")
                
                # Not authenticated -> redirect to Django admin login with next
                login_url = '/admin/login/'
                return redirect(f"{login_url}?next={request.path}")
        
        return None
