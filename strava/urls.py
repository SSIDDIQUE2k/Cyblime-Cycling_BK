from django.urls import path
from . import views

app_name = 'strava'

urlpatterns = [
    path('', views.StravaView.as_view(), name='strava'),
]