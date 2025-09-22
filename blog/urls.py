from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.BlogListView.as_view(), name='list'),
    path('create/', views.BlogCreateView.as_view(), name='create'),
    path('<int:pk>/', views.BlogDetailView.as_view(), name='detail'),
    path('<int:pk>/edit/', views.BlogUpdateView.as_view(), name='edit'),
    path('<int:pk>/delete/', views.BlogDeleteView.as_view(), name='delete'),
    
    # AJAX endpoints for likes and comments
    path('<int:pk>/like/', views.BlogLikeView.as_view(), name='like'),
    path('<int:pk>/comment/', views.CommentCreateView.as_view(), name='comment'),
    path('comment/<int:pk>/delete/', views.CommentDeleteView.as_view(), name='comment_delete'),
]