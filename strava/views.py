from django.shortcuts import render
from django.views.generic import TemplateView


class StravaView(TemplateView):
    template_name = 'strava/strava.html'
