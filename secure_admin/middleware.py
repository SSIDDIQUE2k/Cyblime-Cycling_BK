"""
Secure Admin Middleware for IP whitelisting and security
"""
import logging
from django.http import Http404, HttpResponseForbidden
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.deprecation import MiddlewareMixin
import time

logger = logging.getLogger(__name__)

class IPWhitelistMiddleware(MiddlewareMixin):
    """
    Middleware to restrict admin access to whitelisted IP addresses only
    """
    
    def process_request(self, request):
        # Check if this is an admin portal request
        if request.path.startswith('/secure-admin-') or request.path.startswith('/admin-panel-'):
            # Get client IP
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            # Whitelist of allowed IPs (you should configure this in settings)
            allowed_ips = getattr(settings, 'ADMIN_ALLOWED_IPS', ['127.0.0.1', '::1'])
            
            if ip not in allowed_ips:
                # Log unauthorized access attempt
                logger.warning(f"Unauthorized admin access attempt from IP: {ip}, Path: {request.path}")
                
                # Return 404 to hide the existence of admin portal
                raise Http404("Page not found")
        
        return None

class AdminSecurityMiddleware(MiddlewareMixin):
    """
    Additional security middleware for admin portal
    """
    
    def process_request(self, request):
        # Check for admin portal access
        if request.path.startswith('/secure-admin-') or request.path.startswith('/admin-panel-'):
            # Rate limiting
            ip = self.get_client_ip(request)
            cache_key = f"admin_attempts_{ip}"
            attempts = cache.get(cache_key, 0)
            
            if attempts > 5:  # Max 5 attempts per hour
                logger.warning(f"Admin rate limit exceeded for IP: {ip}")
                raise Http404("Page not found")
            
            # Check for suspicious headers or patterns
            user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
            suspicious_agents = ['bot', 'crawler', 'spider', 'scraper']
            
            if any(agent in user_agent for agent in suspicious_agents):
                logger.warning(f"Suspicious user agent accessing admin: {user_agent} from IP: {ip}")
                raise Http404("Page not found")
        
        return None
    
    def process_response(self, request, response):
        # Remove server headers that might give away Django
        if hasattr(response, 'headers'):
            response.headers.pop('Server', None)
            response.headers.pop('X-Powered-By', None)
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class AdminSessionSecurityMiddleware(MiddlewareMixin):
    """
    Enhanced session security for admin users
    """
    
    def process_request(self, request):
        if request.path.startswith('/secure-admin-') or request.path.startswith('/admin-panel-'):
            # Check if user is authenticated and is admin
            if hasattr(request, 'user') and request.user.is_authenticated:
                # Check session timeout (15 minutes for admin)
                last_activity = request.session.get('last_activity')
                if last_activity:
                    time_since_activity = time.time() - last_activity
                    if time_since_activity > 900:  # 15 minutes
                        logout(request)
                        return redirect('secure_admin:login')
                
                # Update last activity
                request.session['last_activity'] = time.time()
                
                # Verify session IP hasn't changed
                session_ip = request.session.get('session_ip')
                current_ip = self.get_client_ip(request)
                
                if session_ip and session_ip != current_ip:
                    logger.warning(f"Session IP mismatch for user {request.user.username}: {session_ip} vs {current_ip}")
                    logout(request)
                    return redirect('secure_admin:login')
                
                # Set session IP if not set
                if not session_ip:
                    request.session['session_ip'] = current_ip
        
        return None
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip