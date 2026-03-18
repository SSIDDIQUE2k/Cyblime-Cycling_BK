"""
Secure Admin Views
"""
import json
import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction
from .models import AdminProfile, SecurityLog, AdminSession, AdminPermission

User = get_user_model()
logger = logging.getLogger(__name__)

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def log_security_event(user, event_type, ip_address, user_agent, details=None):
    """Log security events"""
    SecurityLog.objects.create(
        user=user,
        event_type=event_type,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details or {}
    )

def admin_required(view_func):
    """Decorator to require admin access"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('secure_admin:login')
        if not (request.user.is_staff or request.user.is_superuser):
            raise Http404("Page not found")
        return view_func(request, *args, **kwargs)
    return wrapper

@never_cache
@csrf_protect
def admin_login(request):
    """
    Secure admin login with rate limiting
    """
    if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
        return redirect('secure_admin:dashboard')
    
    ip = get_client_ip(request)
    
    # Check rate limiting
    cache_key = f"admin_login_attempts_{ip}"
    attempts = cache.get(cache_key, 0)
    
    if attempts >= 5:
        log_security_event(None, 'LOGIN_LOCKED', ip, request.META.get('HTTP_USER_AGENT', ''))
        return render(request, 'secure_admin/login.html', {
            'error': 'Too many failed attempts. Please try again later.',
            'locked': True
        })
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if username and password:
            # Authenticate user
            authenticated_user = authenticate(request, username=username, password=password)
            
            if authenticated_user and authenticated_user.is_active and (authenticated_user.is_staff or authenticated_user.is_superuser):
                cache.delete(cache_key)
                
                # Login user
                login(request, authenticated_user)
                
                # Try to create admin session record (optional - won't fail if model issues)
                try:
                    AdminSession.objects.create(
                        user=authenticated_user,
                        session_key=request.session.session_key or 'no-key',
                        ip_address=ip,
                        user_agent=request.META.get('HTTP_USER_AGENT', '')
                    )
                except Exception:
                    pass  # Continue even if session tracking fails
                
                try:
                    log_security_event(authenticated_user, 'LOGIN_SUCCESS', ip, request.META.get('HTTP_USER_AGENT', ''))
                except Exception:
                    pass  # Continue even if logging fails
                
                return redirect('secure_admin:dashboard')
            else:
                # Increment rate limiting counter
                cache.set(cache_key, attempts + 1, 3600)  # 1 hour
                
                try:
                    log_security_event(None, 'LOGIN_FAILED', ip, request.META.get('HTTP_USER_AGENT', ''), {'username': username})
                except Exception:
                    pass
                
                messages.error(request, 'Invalid credentials.')
        else:
            messages.error(request, 'Please provide both username and password.')
    
    return render(request, 'secure_admin/login.html', {})

@login_required
@admin_required
def admin_dashboard(request):
    """
    Main admin dashboard
    """
    context = {
        'user': request.user,
        'recent_logs': [],
        'active_sessions': [],
        'user_permissions': [],
    }
    
    # Try to get data, but don't fail if models have issues
    try:
        # Get recent security logs
        recent_logs = SecurityLog.objects.filter(
            timestamp__gte=timezone.now() - timezone.timedelta(days=7)
        )[:10]
        context['recent_logs'] = recent_logs
    except Exception:
        pass
    
    try:
        # Get active admin sessions
        active_sessions = AdminSession.objects.filter(
            is_active=True,
            login_time__gte=timezone.now() - timezone.timedelta(hours=24)
        )
        context['active_sessions'] = active_sessions
    except Exception:
        pass
    
    try:
        # Get user's permissions
        user_permissions = AdminPermission.objects.filter(
            user=request.user,
            is_active=True
        ).exclude(
            expires_at__lt=timezone.now()
        )
        context['user_permissions'] = user_permissions
    except Exception:
        pass
    
    return render(request, 'secure_admin/dashboard.html', context)

@login_required
@admin_required
def security_logs(request):
    """
    View security logs - restricted access
    """
    # Check if user has permission to view security logs
    has_permission = AdminPermission.objects.filter(
        user=request.user,
        permission_type='SECURITY_LOGS',
        is_active=True
    ).exclude(
        expires_at__lt=timezone.now()
    ).exists()
    
    if not has_permission and not request.user.is_superuser:
        raise Http404("Page not found")
    
    logs = SecurityLog.objects.all()[:100]  # Last 100 logs
    return render(request, 'secure_admin/security_logs.html', {'logs': logs})

@login_required
@admin_required
def admin_logout(request):
    """
    Secure admin logout
    """
    if request.user.is_authenticated:
        # Update admin session
        try:
            admin_session = AdminSession.objects.get(
                user=request.user,
                session_key=request.session.session_key,
                is_active=True
            )
            admin_session.logout_time = timezone.now()
            admin_session.is_active = False
            admin_session.save()
        except AdminSession.DoesNotExist:
            pass
        
        log_security_event(request.user, 'LOGOUT', get_client_ip(request), 
                          request.META.get('HTTP_USER_AGENT', ''))
        logout(request)
    
    return redirect('secure_admin:login')
