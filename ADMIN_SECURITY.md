# Django Admin Security Configuration

## Overview
This Django project has implemented comprehensive security measures to restrict Django admin access to admin users only.

## Security Features Implemented

### 1. Admin Blocker Middleware (`AdminBlockerMiddleware`)
- **Purpose**: Restricts Django admin access to authenticated admin/staff users only
- **Behavior**: 
  - Allows access only if user is authenticated AND (is_superuser OR is_staff)
  - Returns HTTP 404 for non-admin users to hide admin existence
  - Logs all access attempts for security monitoring

### 2. IP Whitelist Middleware (`IPWhitelistMiddleware`)
- **Purpose**: Restricts admin portal access to specific IP addresses
- **Configuration**: Edit `ADMIN_ALLOWED_IPS` in `settings.py`
- **Default**: localhost (127.0.0.1, ::1)

### 3. Admin Security Middleware (`AdminSecurityMiddleware`)
- **Rate Limiting**: Max 5 attempts per hour per IP
- **Bot Protection**: Blocks suspicious user agents
- **Header Cleaning**: Removes server identifying headers

### 4. Admin Session Security Middleware (`AdminSessionSecurityMiddleware`)
- **Session Timeout**: 15-minute timeout for admin sessions
- **IP Verification**: Ensures session IP hasn't changed
- **Auto-logout**: Automatic logout on security violations

## URL Configuration

### Protected Admin URLs:
- `/hidden-backend-admin/` - Main Django admin (protected)
- `/secure-admin-portal/` - Custom secure admin portal

### Access Control:
- **Admin users** (is_superuser=True OR is_staff=True): Full access
- **Regular users**: HTTP 404 (access denied, hidden)
- **Anonymous users**: HTTP 404 (access denied, hidden)

## Security Logging
- Security events logged to: `logs/security.log`
- Logged events include:
  - Successful admin access
  - Blocked access attempts
  - IP violations
  - Rate limit violations
  - Session security violations

## How It Works

1. When a user tries to access any admin URL
2. `AdminBlockerMiddleware` checks if user is authenticated and has admin privileges
3. If user is admin: Access granted + logged
4. If user is not admin: HTTP 404 returned + attempt logged
5. Additional middleware layers provide extra security (IP, rate limiting, etc.)

## Testing Access

### For Admin Users:
```bash
# Access will work for users with is_superuser=True or is_staff=True
http://localhost:8000/hidden-backend-admin/
```

### For Non-Admin Users:
```bash
# Will return HTTP 404 "Page not found"
http://localhost:8000/hidden-backend-admin/
```

## Current Status
✅ Security middleware: **ENABLED**
✅ Admin users exist: **2 superusers, 2 staff users**
✅ Logging configured: **logs/security.log**
✅ IP whitelist configured: **localhost only**

## Configuration Notes

### To add trusted IPs for production:
Edit `ADMIN_ALLOWED_IPS` in `settings.py`:
```python
ADMIN_ALLOWED_IPS = [
    '127.0.0.1',          # localhost
    '::1',                # localhost IPv6
    '192.168.1.100',      # Office IP
    '203.0.113.0/24',     # IP range
]
```

### To create admin users:
```bash
python manage.py createsuperuser
# OR
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.get(username='existing_user'); user.is_staff = True; user.save()"
```

## Security Best Practices Implemented

1. ✅ **Hidden admin URLs** - Admin moved from `/admin/` to `/hidden-backend-admin/`
2. ✅ **HTTP 404 for unauthorized** - Hides admin existence from non-admins
3. ✅ **User authentication required** - Only authenticated users can attempt access
4. ✅ **Admin privilege verification** - Only is_superuser or is_staff can access
5. ✅ **IP whitelisting** - Additional IP-based restrictions
6. ✅ **Rate limiting** - Prevents brute force attempts
7. ✅ **Session security** - Timeout and IP verification
8. ✅ **Security logging** - All access attempts logged
9. ✅ **Bot protection** - Suspicious user agents blocked

This implementation ensures that only legitimate admin users can access the Django administration interface while keeping it completely hidden from regular users and potential attackers.