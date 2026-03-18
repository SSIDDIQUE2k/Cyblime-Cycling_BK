# Django Admin Access Instructions

## ✅ Admin Portal is Working!

Your Django admin portal is properly configured and working. Here's how to access it:

## 🔑 Admin Credentials

**Existing superuser accounts:**
- Username: `admin`
- Username: `kbroman`

## 🌐 Access URLs

### ❌ Wrong URL (will show 404):
- `http://127.0.0.1:8001/admin/` ← This is blocked for security

### ✅ Correct URL:
- `http://127.0.0.1:8001/hidden-backend-admin/` ← Use this URL

## 📋 How to Access Admin:

1. **Start the server:**
   ```bash
   cd /home/shazib-siddique/Documents/client-project/cyblime-cycling
   source venv/bin/activate
   python manage.py runserver 8001
   ```

2. **Access the admin login page:**
   - Go to: `http://127.0.0.1:8001/hidden-backend-admin/`

3. **Login with admin credentials:**
   - Username: `admin` or `kbroman`
   - Password: [Your password]

4. **If you forgot the password:**
   ```bash
   cd /home/shazib-siddique/Documents/client-project/cyblime-cycling
   source venv/bin/activate
   python manage.py changepassword admin
   ```

## 🛡️ Security Features

- **Hidden URL**: Admin is at `/hidden-backend-admin/` instead of standard `/admin/`
- **IP Whitelist**: Only allowed IPs can access admin
- **User Authentication**: Only superuser/staff can access
- **Session Security**: Enhanced session timeouts for admin users

## 🔧 Create New Admin User (if needed):

```bash
cd /home/shazib-siddique/Documents/client-project/cyblime-cycling
source venv/bin/activate
python manage.py createsuperuser
```

## 📱 User Dashboard vs Admin Panel

- **User Dashboard**: `http://127.0.0.1:8001/dashboard/` (for regular users)
- **Admin Panel**: `http://127.0.0.1:8001/hidden-backend-admin/` (for admins only)

Both systems are separate but connected - they work with the same data but provide different interfaces.

---

**Note**: The admin portal security is working as designed. The `/admin/` URL returns 404 to hide the admin panel from attackers, while the secure URL `/hidden-backend-admin/` provides access to authorized users.