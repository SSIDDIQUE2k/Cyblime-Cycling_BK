# User Model AttributeError Fix

## Problem Description

You encountered this error when accessing `/admin/adminlogin/`:

```
AttributeError: Manager isn't available; 'auth.User' has been swapped for 'users.User'
Exception Location: core.views.material_admin_dashboard
```

## Root Cause

The error occurred because your Django project uses a custom user model (`users.User`) configured with:
```python
AUTH_USER_MODEL = 'users.User'
```

However, some views in `core/views.py` were still importing and using the default Django User model:
```python
from django.contrib.auth.models import User  # ❌ Incorrect - uses default User model
```

## Solution Applied

### 1. Fixed User Model Import
**File**: `core/views.py`

**Before**:
```python
from django.contrib.auth.models import User
```

**After**:
```python
from django.contrib.auth import get_user_model
```

### 2. Updated View Functions
Updated the views to use `get_user_model()` to get the correct custom User model:

**material_admin_dashboard view** (line 42-52):
```python
@user_passes_test(is_staff_user)
def material_admin_dashboard(request):
    """Material Design Admin Dashboard"""
    User = get_user_model()  # ✅ Get custom User model
    context = {
        'user_count': User.objects.count(),
        # ... rest of the context
    }
    return render(request, 'core/material_admin/dashboard.html', context)
```

**material_admin_users view** (line 55-61):
```python
@user_passes_test(is_staff_user)
def material_admin_users(request):
    """User management"""
    User = get_user_model()  # ✅ Get custom User model
    context = {
        'users': User.objects.all().order_by('-date_joined')[:50]
    }
    return render(request, 'core/material_admin/users.html', context)
```

## Why This Fix Works

1. **get_user_model()** is Django's recommended way to reference the User model
2. It automatically returns the custom User model when `AUTH_USER_MODEL` is set
3. It ensures compatibility with custom user models
4. It prevents the "Manager isn't available" error

## Verification

The fix was tested and confirmed working:

```bash
✅ SUCCESS: material_admin_dashboard view executed without errors!
Response status: 200
Content type: text/html; charset=utf-8

✅ SUCCESS: material_admin_users view executed without errors!
Response status: 200
```

## Best Practices Applied

### ✅ **DO - Use get_user_model()**
```python
from django.contrib.auth import get_user_model
User = get_user_model()
users = User.objects.all()
```

### ❌ **DON'T - Import User directly**
```python
from django.contrib.auth.models import User  # Will break with custom user models
```

### ✅ **Alternative - Import custom User directly**
```python
from users.models import User  # Also acceptable for this project
```

## Related Files Checked

- ✅ `blog/views.py` - Uses `request.user` (correct)
- ✅ `dashboard/views.py` - Imports `from users.models import User` (correct)
- ✅ `users/views.py` - Uses `request.user` and proper imports (correct)
- ✅ Other view files - No direct User model imports found

## Admin Security Status

Your admin security system is working correctly:
- ✅ Admin middleware is enabled and blocking unauthorized access
- ✅ URLs return 404 for non-admin users (security through obscurity)
- ✅ Material admin views now work for authenticated admin users

## URL Structure

The material admin portal is accessible at:
- `/admin/adminlogin/` - Dashboard (now fixed)
- `/admin/adminlogin/users/` - User management (now fixed)  
- `/admin/adminlogin/content/` - Content management
- `/admin/adminlogin/slideshow/` - Slideshow management
- `/admin/adminlogin/settings/` - Site settings

All views now properly use the custom `users.User` model instead of the default `auth.User` model.

## Conclusion

The AttributeError has been **completely resolved**. The admin dashboard and user management views now work correctly with your custom user model configuration.