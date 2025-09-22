"""
Emergency Django Admin Access
Only accessible to authenticated superusers through secure admin portal
"""
from django.contrib import admin
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import redirect
from django.urls import include, path
from django.http import Http404
from .views import get_client_ip, log_security_event

def is_superuser_and_authenticated(user):
    """Check if user is authenticated superuser"""
    return user.is_authenticated and user.is_superuser

@user_passes_test(is_superuser_and_authenticated, login_url='/secure-admin-portal/auth/secure-gateway/')
def emergency_admin_access(request):
    """
    Emergency access to Django admin for superusers only
    Logs all access attempts
    """
    if not request.user.is_superuser:
        raise Http404("Page not found")
    
    # Log emergency admin access
    log_security_event(
        request.user, 
        'EMERGENCY_ADMIN_ACCESS', 
        get_client_ip(request), 
        request.META.get('HTTP_USER_AGENT', ''),
        {'accessed_by': request.user.username}
    )
    
    # Redirect to Django admin
    return redirect('/emergency-django-admin/')

# Emergency admin URLs - only accessible through secure portal
emergency_admin_urlpatterns = [
    path('emergency-django-admin/', admin.site.urls),
]