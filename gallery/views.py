from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy
from django.contrib import messages
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
        return Photo.objects.select_related('uploaded_by')


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
