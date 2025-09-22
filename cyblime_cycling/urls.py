"""
URL configuration for cyblime_cycling project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin portal - protected by middleware; accessible at /admin
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('users/', include('users.urls')),
    # Social auth / Allauth endpoints
    path('accounts/', include('allauth.urls')),
    path('blog/', include('blog.urls')),
    path('events/', include('events.urls')),
    path('articles/', include('articles.urls')),
    path('gallery/', include('gallery.urls')),
    path('store/', include('store.urls')),
    path('strava/', include('strava.urls')),
    # User Dashboard - Separate from Django admin
    path('dashboard/', include('dashboard.urls')),
    # Profile URLs
    path('u/<str:username>/', include('users.urls', namespace='profile')),
    # Note: Admin URL simplified to /admin
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
