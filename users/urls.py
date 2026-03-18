from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .auth_views import ModernLoginView, ModernLogoutView, ajax_login, ajax_logout, user_session_status

app_name = 'users'

urlpatterns = [
    # Modern Authentication URLs
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', ModernLoginView.as_view(), name='login'),
    path('logout/', ModernLogoutView.as_view(http_method_names=['get', 'post']), name='logout'),
    
    # AJAX Authentication API
    path('api/login/', ajax_login, name='ajax_login'),
    path('api/logout/', ajax_logout, name='ajax_logout'),
    path('api/session-status/', user_session_status, name='session_status'),
    
    # Profile Management
    path('profile/edit/', views.ProfileEditView.as_view(), name='profile_edit'),
    
    # Profile URLs - these will work with /u/<username>/
    path('', views.ProfileView.as_view(), name='profile'),
    path('posts/', views.UserPostsView.as_view(), name='user_posts'),
]
