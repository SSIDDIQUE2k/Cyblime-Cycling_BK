# Railway Deployment Guide

This guide will help you deploy your Django Cyblime Cycling project to Railway.

## Pre-Deployment Checklist

✅ All issues have been fixed:
- Added missing `python-dotenv` dependency to requirements.txt
- Created railway.json configuration file
- Created runtime.txt to specify Python version
- Verified all Django apps exist and are properly configured
- Admin access restriction is properly implemented via `secure_admin` middleware

## Railway Deployment Steps

### 1. Prepare Your Repository
Make sure your code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### 2. Connect to Railway
1. Go to [Railway](https://railway.app)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `cyblime-cycling` repository

### 3. Configure Environment Variables
In Railway dashboard, go to your project > Variables and add:

**Required Variables:**
```
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Optional Variables:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
WEB_CONCURRENCY=2
```

### 4. Database Setup
Railway will automatically provision a PostgreSQL database and set the `DATABASE_URL` environment variable.

### 5. Domain Configuration
After deployment, Railway will provide a domain like `your-app.up.railway.app`. You need to:
1. Copy the domain from Railway dashboard
2. Add it to your ALLOWED_HOSTS variable in Railway:
   ```
   ALLOWED_HOSTS=localhost,127.0.0.1,your-app.up.railway.app
   ```

## Post-Deployment Setup

### Create Superuser
After successful deployment, create a superuser for admin access:
1. Go to Railway dashboard > your project > Service
2. Open "Command Line" or use Railway CLI
3. Run: `python manage.py createsuperuser`

### Admin Access
Your Django admin is secured and only accessible to admin users at:
- Standard admin: `https://your-app.up.railway.app/admin/`
- Emergency admin: `https://your-app.up.railway.app/secure-admin-portal/emergency-django-admin/`

## Troubleshooting

### Common Issues:

1. **Build Fails - Missing Dependencies**
   - Check that all requirements are in requirements.txt
   - Verify Python version in runtime.txt matches your local version

2. **Database Connection Issues**
   - Railway automatically provides DATABASE_URL
   - Check that `dj-database-url` and `psycopg[binary]` are in requirements.txt

3. **Static Files Not Loading**
   - Railway runs `collectstatic` automatically via entrypoint.sh
   - Verify STATIC_ROOT and WhiteNoise configuration in settings.py

4. **Admin Access Blocked**
   - The secure_admin middleware protects admin access
   - Only superuser/staff users can access admin
   - Use the emergency admin portal if needed

### Railway CLI Commands:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# View logs
railway logs

# Run commands in production
railway run python manage.py createsuperuser
```

## Security Features

Your deployment includes several security features:
- Admin access restricted to admin users only (per your requirements)
- HTTPS enforcement in production
- Secure cookie settings
- CSRF protection
- IP-based admin access logging
- WhiteNoise for static file security

## Files Added/Modified for Deployment:
- ✅ Added `python-dotenv==1.0.0` to requirements.txt
- ✅ Created railway.json configuration
- ✅ Created runtime.txt for Python version
- ✅ Created .env.example for environment variables documentation
- ✅ Verified entrypoint.sh has proper permissions

Your project is now ready for Railway deployment!