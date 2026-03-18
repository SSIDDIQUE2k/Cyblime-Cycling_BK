from django.urls import path
from . import views

app_name = 'gallery'

urlpatterns = [
    path('', views.GalleryListView.as_view(), name='list'),
    path('upload/', views.PhotoUploadView.as_view(), name='upload'),
    path('<int:pk>/delete/', views.PhotoDeleteView.as_view(), name='delete'),
]