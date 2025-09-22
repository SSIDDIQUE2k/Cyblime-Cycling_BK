"""
Secure Admin URLs - Hidden paths for security
"""
from django.urls import path, include
from . import views
from .emergency_admin import emergency_admin_access, emergency_admin_urlpatterns

# Use obscured URL patterns to hide admin portal from discovery
app_name = 'secure_admin'

urlpatterns = [
    # Login/Logout with obscured paths
    path('auth/secure-gateway/', views.admin_login, name='login'),
    path('auth/secure-exit/', views.admin_logout, name='logout'),
    
    # Main dashboard with hidden path
    path('control-panel/dashboard/', views.admin_dashboard, name='dashboard'),
    
    # Security monitoring
    path('monitoring/security-audit/', views.security_logs, name='security_logs'),
    
    # Emergency Django admin access (superusers only)
    path('emergency/django-admin-access/', emergency_admin_access, name='emergency_admin'),
    
] + emergency_admin_urlpatterns
