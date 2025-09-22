"""
Enhanced Authentication Views
Modern authentication system with improved UX
"""
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView as DjangoLoginView, LogoutView as DjangoLogoutView
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.conf import settings
import time

User = get_user_model()

class ModernLoginView(DjangoLoginView):
    """
    Modern login view with enhanced features
    """
    template_name = 'users/login_modern.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        """Redirect based on user type"""
        if self.request.user.is_superuser:
            messages.success(self.request, f'Welcome back, {self.request.user.get_full_name() or self.request.user.username}!')
            return '/secure-admin-portal/control-panel/dashboard/'
        else:
            messages.success(self.request, f'Welcome back, {self.request.user.get_full_name() or self.request.user.username}!')
            return super().get_success_url()
    
    def form_invalid(self, form):
        """Enhanced error handling"""
        # Track failed login attempts
        ip_address = self.get_client_ip()
        cache_key = f"login_attempts_{ip_address}"
        attempts = cache.get(cache_key, 0) + 1
        cache.set(cache_key, attempts, 3600)  # 1 hour
        
        if attempts >= 5:
            messages.error(self.request, 'Too many failed login attempts. Please try again later.')
        else:
            messages.error(self.request, 'Invalid username or password. Please try again.')
        
        return super().form_invalid(form)
    
    def form_valid(self, form):
        """Enhanced success handling"""
        # Clear failed attempts on successful login
        ip_address = self.get_client_ip()
        cache_key = f"login_attempts_{ip_address}"
        cache.delete(cache_key)
        
        # Add remember me functionality
        remember_me = self.request.POST.get('remember_me')
        if remember_me:
            self.request.session.set_expiry(1209600)  # 2 weeks
        else:
            self.request.session.set_expiry(0)  # Browser session
        
        return super().form_valid(form)
    
    def get_client_ip(self):
        """Get client IP address"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip

class ModernLogoutView(DjangoLogoutView):
    """
    Modern logout view with complete session cleanup
    """
    template_name = 'registration/logged_out.html'
    next_page = None  # Don't auto-redirect
    
    def dispatch(self, request, *args, **kwargs):
        """Enhanced logout with complete cleanup"""
        if request.user.is_authenticated:
            user_name = request.user.get_full_name() or request.user.username
            
            # Force logout
            logout(request)
            
            # Clear all session data
            request.session.flush()
            
            # Clear cache for this user if any
            if hasattr(request, 'session') and request.session.session_key:
                cache.delete(f"user_session_{request.session.session_key}")
            
            # Add success message after logout
            messages.success(request, f'Goodbye {user_name}! You have been successfully logged out.')
        
        return super().dispatch(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        """Add extra context to logout template"""
        context = super().get_context_data(**kwargs)
        context['logout_complete'] = True
        return context

@require_http_methods(["POST"])
@csrf_protect
def ajax_login(request):
    """
    AJAX login endpoint for modern frontend integration
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        remember_me = data.get('remember_me', False)
        
        if not username or not password:
            return JsonResponse({
                'success': False,
                'error': 'Username and password are required'
            }, status=400)
        
        # Check rate limiting
        ip_address = get_client_ip(request)
        cache_key = f"login_attempts_{ip_address}"
        attempts = cache.get(cache_key, 0)
        
        if attempts >= 5:
            return JsonResponse({
                'success': False,
                'error': 'Too many failed login attempts. Please try again later.'
            }, status=429)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_active:
            # Successful login
            login(request, user)
            cache.delete(cache_key)  # Clear failed attempts
            
            # Handle remember me
            if remember_me:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)  # Browser session
            
            # Determine redirect URL
            if user.is_superuser:
                redirect_url = '/secure-admin-portal/control-panel/dashboard/'
            else:
                redirect_url = '/'
            
            return JsonResponse({
                'success': True,
                'message': f'Welcome back, {user.get_full_name() or user.username}!',
                'redirect_url': redirect_url,
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'is_superuser': user.is_superuser
                }
            })
        else:
            # Failed login
            cache.set(cache_key, attempts + 1, 3600)  # Increment attempts
            
            return JsonResponse({
                'success': False,
                'error': 'Invalid username or password'
            }, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': 'An error occurred during login'
        }, status=500)

@login_required
@require_http_methods(["POST"])
def ajax_logout(request):
    """
    AJAX logout endpoint
    """
    user_name = request.user.get_full_name() or request.user.username
    logout(request)
    
    return JsonResponse({
        'success': True,
        'message': f'Goodbye, {user_name}! You have been logged out successfully.'
    })

@login_required
def user_session_status(request):
    """
    Get current user session status
    """
    return JsonResponse({
        'authenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'full_name': request.user.get_full_name(),
            'is_superuser': request.user.is_superuser,
            'is_staff': request.user.is_staff,
            'date_joined': request.user.date_joined.isoformat(),
            'last_login': request.user.last_login.isoformat() if request.user.last_login else None
        },
        'session': {
            'session_key': request.session.session_key,
            'expire_age': request.session.get_expiry_age(),
            'expire_date': request.session.get_expiry_date().isoformat()
        }
    })

def get_client_ip(request):
    """Helper function to get client IP"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip