"""
Secure Admin Models
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import secrets
try:
    import pyotp
except ImportError:
    pyotp = None

User = get_user_model()

class AdminProfile(models.Model):
    """
    Extended profile for admin users with additional security features
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Admin Profile"
        verbose_name_plural = "Admin Profiles"
    
    def __str__(self):
        return f"Admin Profile - {self.user.username}"
    
    def generate_2fa_secret(self):
        """Generate a new 2FA secret"""
        if pyotp:
            self.two_factor_secret = pyotp.random_base32()
            self.save()
        return self.two_factor_secret
    
    def get_2fa_qr_code(self, service_name="CyblimeCycling Admin"):
        """Get QR code for 2FA setup"""
        if not pyotp:
            return None
            
        if not self.two_factor_secret:
            self.generate_2fa_secret()
        
        totp = pyotp.TOTP(self.two_factor_secret)
        qr_url = totp.provisioning_uri(
            name=self.user.email,
            issuer_name=service_name
        )
        return qr_url
    
    def verify_2fa_token(self, token):
        """Verify 2FA token"""
        if not pyotp or not self.two_factor_enabled or not self.two_factor_secret:
            return False
        
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token, valid_window=1)
    
    def generate_backup_codes(self, count=8):
        """Generate backup codes for 2FA"""
        codes = [secrets.token_hex(4).upper() for _ in range(count)]
        self.backup_codes = codes
        self.save()
        return codes
    
    def use_backup_code(self, code):
        """Use a backup code"""
        if code.upper() in self.backup_codes:
            self.backup_codes.remove(code.upper())
            self.save()
            return True
        return False
    
    def is_locked(self):
        """Check if account is locked"""
        if self.locked_until:
            return timezone.now() < self.locked_until
        return False
    
    def lock_account(self, duration_minutes=30):
        """Lock account for specified duration"""
        self.locked_until = timezone.now() + timezone.timedelta(minutes=duration_minutes)
        self.save()

class AdminSession(models.Model):
    """
    Track admin sessions for security monitoring
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Admin Session"
        verbose_name_plural = "Admin Sessions"
    
    def __str__(self):
        return f"{self.user.username} - {self.ip_address} - {self.login_time}"

class SecurityLog(models.Model):
    """
    Log security events for monitoring
    """
    EVENT_TYPES = [
        ('LOGIN_SUCCESS', 'Login Success'),
        ('LOGIN_FAILED', 'Login Failed'),
        ('LOGIN_LOCKED', 'Login Locked'),
        ('LOGOUT', 'Logout'),
        ('2FA_ENABLED', '2FA Enabled'),
        ('2FA_DISABLED', '2FA Disabled'),
        ('PASSWORD_CHANGED', 'Password Changed'),
        ('UNAUTHORIZED_ACCESS', 'Unauthorized Access'),
        ('SUSPICIOUS_ACTIVITY', 'Suspicious Activity'),
        ('EMERGENCY_ADMIN_ACCESS', 'Emergency Admin Access'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    event_type = models.CharField(max_length=25, choices=EVENT_TYPES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Security Log"
        verbose_name_plural = "Security Logs"
        ordering = ['-timestamp']
    
    def __str__(self):
        username = self.user.username if self.user else 'Anonymous'
        return f"{self.event_type} - {username} - {self.ip_address}"

class AdminPermission(models.Model):
    """
    Custom permissions for admin users
    """
    PERMISSION_TYPES = [
        ('USER_MANAGEMENT', 'User Management'),
        ('CONTENT_MANAGEMENT', 'Content Management'),
        ('SYSTEM_SETTINGS', 'System Settings'),
        ('SECURITY_LOGS', 'Security Logs'),
        ('ANALYTICS', 'Analytics'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_permissions')
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPES)
    granted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Admin Permission"
        verbose_name_plural = "Admin Permissions"
        unique_together = ['user', 'permission_type']
    
    def __str__(self):
        return f"{self.user.username} - {self.permission_type}"
    
    def is_expired(self):
        """Check if permission is expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
