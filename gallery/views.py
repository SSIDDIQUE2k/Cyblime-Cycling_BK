from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Photo
from .forms import PhotoForm


class StaffRequiredMixin:
    """Mixin to require staff permissions"""
    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class GalleryListView(ListView):
    model = Photo
    template_name = 'gallery/list.html'
    context_object_name = 'photos'
    paginate_by = 12
    
    def get_queryset(self):
        queryset = Photo.objects.select_related('uploaded_by')
        
        # Search filter
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Date filter
        date_filter = self.request.GET.get('date')
        if date_filter:
            now = timezone.now()
            if date_filter == 'today':
                queryset = queryset.filter(uploaded_at__date=now.date())
            elif date_filter == 'week':
                week_ago = now - timedelta(days=7)
                queryset = queryset.filter(uploaded_at__gte=week_ago)
            elif date_filter == 'month':
                month_ago = now - timedelta(days=30)
                queryset = queryset.filter(uploaded_at__gte=month_ago)
            elif date_filter == 'year':
                year_ago = now - timedelta(days=365)
                queryset = queryset.filter(uploaded_at__gte=year_ago)
        
        # Author filter
        author = self.request.GET.get('author')
        if author:
            queryset = queryset.filter(uploaded_by__username__icontains=author)
        
        # Sort filter
        sort = self.request.GET.get('sort', '-uploaded_at')
        if sort in ['uploaded_at', '-uploaded_at', 'title', '-title']:
            queryset = queryset.order_by(sort)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add filter parameters to context for form persistence
        context['current_search'] = self.request.GET.get('search', '')
        context['current_date'] = self.request.GET.get('date', '')
        context['current_author'] = self.request.GET.get('author', '')
        context['current_sort'] = self.request.GET.get('sort', '-uploaded_at')
        # Get unique authors for filter dropdown
        context['authors'] = Photo.objects.select_related('uploaded_by').values_list(
            'uploaded_by__username', flat=True
        ).distinct().order_by('uploaded_by__username')
        return context


class PhotoUploadView(LoginRequiredMixin, StaffRequiredMixin, CreateView):
    model = Photo
    form_class = PhotoForm
    template_name = 'gallery/upload.html'
    success_url = reverse_lazy('gallery:list')
    
    def form_valid(self, form):
        form.instance.uploaded_by = self.request.user
        messages.success(self.request, 'Photo uploaded successfully!')
        return super().form_valid(form)


class PhotoDeleteView(LoginRequiredMixin, StaffRequiredMixin, DeleteView):
    model = Photo
    success_url = reverse_lazy('gallery:list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Photo deleted successfully!')
        return super().delete(request, *args, **kwargs)
