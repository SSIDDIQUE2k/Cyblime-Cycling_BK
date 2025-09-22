# Secure Admin Portal Setup Guide

## 🔐 IMPORTANT SECURITY NOTICE

This secure admin portal is designed to be **COMPLETELY HIDDEN** from the outside community. It implements multiple layers of security to ensure unauthorized access is impossible.

## Features Implemented

✅ **IP Whitelisting** - Only specific IP addresses can access the admin portal  
✅ **Hidden URLs** - Obscured URL paths that won't be discoverable  
✅ **Rate Limiting** - Protection against brute force attacks  
✅ **Session Security** - Enhanced session management with timeouts  
✅ **Security Logging** - Complete audit trail of all access attempts  
✅ **Account Lockout** - Automatic lockout after failed attempts  
✅ **Role-Based Access** - Granular permission system  

## Quick Setup Steps

### 1. Configure IP Whitelist (CRITICAL)

Edit `cyblime_cycling/settings.py` and update the `ADMIN_ALLOWED_IPS` list:

```python
ADMIN_ALLOWED_IPS = [
    '127.0.0.1',        # localhost
    '::1',              # localhost IPv6
    '192.168.1.100',    # Your home IP
    '203.0.113.45',     # Your office IP
    # Add all trusted IP addresses here
]
```

### 2. Create Admin User

```bash
python manage.py createsuperuser
```

### 3. Create Admin Profile

Start Django and access the admin portal to create an AdminProfile:

```bash
python manage.py runserver
```

### 4. Access Points

**NEVER share these URLs publicly!**

- **Login**: `http://localhost:8000/secure-admin-portal/auth/secure-gateway/`
- **Dashboard**: `http://localhost:8000/secure-admin-portal/control-panel/dashboard/`
- **Security Logs**: `http://localhost:8000/secure-admin-portal/monitoring/security-audit/`

## Security Features Explained

### 🛡️ Multiple Security Layers

1. **IP Whitelisting**: Only predefined IP addresses can access admin URLs
2. **Hidden Paths**: Admin URLs are obscured and not linked from public pages
3. **Rate Limiting**: Maximum 5 failed login attempts per hour per IP
4. **Account Lockout**: Users locked for 30 minutes after 5 failed attempts
5. **Session Security**: 15-minute session timeout with IP validation
6. **Security Logging**: All access attempts logged for monitoring

### 🚨 What Happens to Unauthorized Users

- **Wrong IP**: Returns 404 (page not found) - hides portal existence
- **Bot/Crawler**: Returns 404 and logs suspicious activity  
- **Brute Force**: Rate limited and logged as security threat
- **Session Hijack**: Detected and automatically logged out

### 📊 Monitoring & Alerts

All security events are logged to:
- Database: `SecurityLog` model
- File: `logs/security.log`

Events tracked:
- Login Success/Failed
- Account Lockouts  
- Unauthorized Access Attempts
- Suspicious Activity
- Session Changes

## Production Deployment

### 1. Environment Variables

Create a `.env` file:

```bash
SECRET_KEY=your-super-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=your-database-url

# Admin Security
ADMIN_ALLOWED_IPS=your.office.ip.address,your.home.ip.address
```

### 2. Security Checklist

- [ ] Update `ADMIN_ALLOWED_IPS` with your real IP addresses
- [ ] Set `DEBUG = False` in production
- [ ] Use HTTPS in production
- [ ] Set up log rotation for security logs
- [ ] Configure email alerts for suspicious activity
- [ ] Regular security log reviews
- [ ] Backup security logs

### 3. Additional Security (Optional)

For even more security, consider:

1. **VPN Access Only**: Require VPN connection
2. **Change URL Paths**: Modify the hidden URLs in `secure_admin/urls.py`
3. **Firewall Rules**: Block admin URLs at server level
4. **Two-Factor Authentication**: The models are ready for TOTP 2FA

## Troubleshooting

### Can't Access Admin Portal

1. **Check Your IP**: Make sure your current IP is in `ADMIN_ALLOWED_IPS`
2. **Clear Cache**: Django cache might need clearing
3. **Check Logs**: Look in `logs/security.log` for error details

### Account Locked

1. **Wait 30 Minutes**: Lockouts expire automatically
2. **Admin Override**: Superuser can unlock via Django admin
3. **Database Reset**: Clear `failed_login_attempts` in database

### Session Issues

1. **Clear Browser Cache**: Remove all cookies
2. **Check IP Changes**: VPN/proxy changes can trigger logouts
3. **Session Timeout**: Sessions expire after 15 minutes of inactivity

## URL Structure

The admin portal uses these hidden URL patterns:

```
/secure-admin-portal/
├── auth/
│   ├── secure-gateway/     # Login page
│   └── secure-exit/        # Logout
└── control-panel/
│   └── dashboard/          # Main dashboard
└── monitoring/
    └── security-audit/     # Security logs
```

## Maintenance

### Daily Tasks
- Monitor security logs for suspicious activity
- Review failed login attempts
- Check active admin sessions

### Weekly Tasks  
- Audit admin user permissions
- Review and rotate log files
- Update IP whitelist if needed

### Monthly Tasks
- Security assessment of admin portal
- Update admin user passwords
- Review and update security policies

## Emergency Access

If you're locked out:

1. **Direct Database Access**: Manually reset `AdminProfile.failed_login_attempts`
2. **Django Admin**: Use standard Django admin to manage users
3. **Server Access**: SSH in and reset via management commands

## Contact

For security issues or questions about the admin portal, contact your system administrator immediately.

---

**⚠️ SECURITY WARNING**: Never share admin URLs, credentials, or access logs with unauthorized personnel. This admin portal contains sensitive system controls and should be treated with the highest security standards.