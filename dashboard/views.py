from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, UpdateView, ListView
from django.contrib import messages
from django.urls import reverse_lazy
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from users.models import User
from blog.models import BlogPost
from events.models import Event
from gallery.models import Photo
from users.forms import ProfileEditForm


class DashboardOverview(LoginRequiredMixin, TemplateView):
    """Main dashboard overview for users"""
    template_name = 'dashboard/overview.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # User statistics
        context.update({
            'user_stats': {
                'total_posts': BlogPost.objects.filter(author=user).count(),
                'total_images': Photo.objects.filter(uploaded_by=user).count(),
'events_joined': Event.objects.filter(participants=user).count(),
                'days_member': (timezone.now().date() - user.date_joined.date()).days,
            },
            'recent_posts': BlogPost.objects.filter(author=user)[:3],
'upcoming_events': Event.objects.filter(
                participants=user,
                date__gte=timezone.now()
            )[:3],
            'recent_images': Photo.objects.filter(uploaded_by=user)[:6],
        })
        
        return context


class DashboardPosts(LoginRequiredMixin, ListView):
    """User's blog posts management"""
    model = BlogPost
    template_name = 'dashboard/posts.html'
    context_object_name = 'posts'
    paginate_by = 10
    
    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user).order_by('-created_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_posts'] = self.get_queryset().count()
        context['published_posts'] = self.get_queryset().filter(status='published').count()
        context['draft_posts'] = self.get_queryset().filter(status='draft').count()
        return context


class DashboardEvents(LoginRequiredMixin, TemplateView):
    """User's events dashboard"""
    template_name = 'dashboard/events.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        now = timezone.now()

        created_events = (
            Event.objects.filter(created_by=user)
            .select_related('created_by')
            .order_by('-date')
        )
        joined_upcoming = (
            Event.objects.filter(participants=user, date__gte=now)
            .select_related('created_by')
            .order_by('date')
        )
        joined_past = (
            Event.objects.filter(participants=user, date__lt=now)
            .select_related('created_by')
            .order_by('-date')
        )

        context.update({
            'created_events': created_events,
            'joined_upcoming': joined_upcoming,
            'joined_past': joined_past,
            'created_count': created_events.count(),
            'joined_upcoming_count': joined_upcoming.count(),
            'joined_past_count': joined_past.count(),
        })
        
        return context


class DashboardGallery(LoginRequiredMixin, ListView):
    """User's gallery images"""
    model = Photo
    template_name = 'dashboard/gallery.html'
    context_object_name = 'images'
    paginate_by = 12
    
    def get_queryset(self):
        return Photo.objects.filter(uploaded_by=self.request.user).order_by('-uploaded_at')


class DashboardProfile(LoginRequiredMixin, UpdateView):
    """User profile editing within dashboard"""
    model = User
    form_class = ProfileEditForm
    template_name = 'dashboard/profile.html'
    success_url = reverse_lazy('dashboard:profile')
    
    def get_object(self):
        return self.request.user
    
    def form_valid(self, form):
        messages.success(self.request, 'Profile updated successfully!')
        return super().form_valid(form)


class DashboardSettings(LoginRequiredMixin, TemplateView):
    """User account settings"""
    template_name = 'dashboard/settings.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        context.update({
            'user': user,
            'account_created': user.date_joined,
            'last_login': user.last_login,
        })
        
        return context


class DashboardStats(LoginRequiredMixin, TemplateView):
    """Detailed cycling statistics for user"""
    template_name = 'dashboard/stats.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Calculate various statistics
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        context.update({
            'cycling_stats': {
                'total_posts': BlogPost.objects.filter(author=user).count(),
                'posts_this_month': BlogPost.objects.filter(
                    author=user, 
                    created_at__gte=thirty_days_ago
                ).count(),
                'total_events': Event.objects.filter(created_by=user).count(),
                'events_this_month': Event.objects.filter(
                    created_by=user,
                    date__gte=thirty_days_ago
                ).count(),
                'gallery_contributions': Photo.objects.filter(uploaded_by=user).count(),
                'member_since': user.date_joined,
                'activity_level': self._calculate_activity_level(user),
            }
        })
        
        return context
    
    def _calculate_activity_level(self, user):
        """Calculate user activity level based on contributions"""
        posts = BlogPost.objects.filter(author=user).count()
        images = Photo.objects.filter(uploaded_by=user).count()
        events = Event.objects.filter(created_by=user).count()
        
        total_activity = posts + images + events
        
        if total_activity >= 50:
            return "Expert Cyclist"
        elif total_activity >= 20:
            return "Active Rider"
        elif total_activity >= 5:
            return "Regular Member"
        else:
            return "New Rider"