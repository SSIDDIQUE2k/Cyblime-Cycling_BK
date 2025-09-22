from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy, reverse
from django.contrib import messages
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import HttpResponseNotAllowed
from .models import Event
from .forms import EventForm


class StaffRequiredMixin:
    """Mixin to require staff permissions"""
    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class EventListView(ListView):
    model = Event
    template_name = 'events/list.html'
    context_object_name = 'events'
    paginate_by = 10
    
    def get_queryset(self):
        return Event.objects.select_related('created_by')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        now = timezone.now()
        context['upcoming_events'] = (
            Event.objects.filter(date__gte=now)
            .select_related('created_by')
            .prefetch_related('participants')
        )
        context['past_events'] = (
            Event.objects.filter(date__lt=now)
            .select_related('created_by')
            .prefetch_related('participants')
        )
        return context


class EventDetailView(DetailView):
    model = Event
    template_name = 'events/detail.html'
    context_object_name = 'event'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.object
        user = self.request.user
        context['is_joined'] = False
        if user.is_authenticated:
            context['is_joined'] = event.participants.filter(pk=user.pk).exists()
        return context

class EventCreateView(LoginRequiredMixin, StaffRequiredMixin, CreateView):
    model = Event
    form_class = EventForm
    template_name = 'events/create.html'
    
    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Event created successfully!')
        return super().form_valid(form)


class EventUpdateView(LoginRequiredMixin, StaffRequiredMixin, UpdateView):
    model = Event
    form_class = EventForm
    template_name = 'events/edit.html'
    
    def form_valid(self, form):
        messages.success(self.request, 'Event updated successfully!')
        return super().form_valid(form)


class EventDeleteView(LoginRequiredMixin, StaffRequiredMixin, DeleteView):
    model = Event
    template_name = 'events/delete.html'
    success_url = reverse_lazy('events:list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Event deleted successfully!')
        return super().delete(request, *args, **kwargs)


@login_required
def join_event(request, pk):
    # Allow GET in development to avoid CSRF friction; enforce POST in production
    if request.method != 'POST' and not settings.DEBUG:
        return HttpResponseNotAllowed(['POST'])
    event = get_object_or_404(Event, pk=pk)
    if event.is_past_event:
        messages.error(request, 'Cannot join a past event.')
        return redirect(event.get_absolute_url())
    event.participants.add(request.user)
    messages.success(request, 'You have joined this event!')
    return redirect(event.get_absolute_url())


@login_required
def leave_event(request, pk):
    # Allow GET in development to avoid CSRF friction; enforce POST in production
    if request.method != 'POST' and not settings.DEBUG:
        return HttpResponseNotAllowed(['POST'])
    event = get_object_or_404(Event, pk=pk)
    event.participants.remove(request.user)
    messages.info(request, 'You have left this event.')
    return redirect(event.get_absolute_url())
