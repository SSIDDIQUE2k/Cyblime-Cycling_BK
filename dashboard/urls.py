from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Main dashboard overview
    path('', views.DashboardOverview.as_view(), name='overview'),
    
    # Content management
    path('posts/', views.DashboardPosts.as_view(), name='posts'),
    path('events/', views.DashboardEvents.as_view(), name='events'),
    path('gallery/', views.DashboardGallery.as_view(), name='gallery'),
    
    # Profile and account
    path('profile/', views.DashboardProfile.as_view(), name='profile'),
    path('settings/', views.DashboardSettings.as_view(), name='settings'),
    
    # Statistics
    path('stats/', views.DashboardStats.as_view(), name='stats'),
]