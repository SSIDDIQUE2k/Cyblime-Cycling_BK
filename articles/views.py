from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Article
from .forms import ArticleForm


class StaffRequiredMixin:
    """Mixin to require staff permissions"""
    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class ArticleListView(ListView):
    model = Article
    template_name = 'articles/list.html'
    context_object_name = 'articles'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = Article.objects.select_related('created_by')
        
        # Search filter
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search)
            )
        
        # Date filter
        date_filter = self.request.GET.get('date')
        if date_filter:
            now = timezone.now()
            if date_filter == 'today':
                queryset = queryset.filter(created_at__date=now.date())
            elif date_filter == 'week':
                week_ago = now - timedelta(days=7)
                queryset = queryset.filter(created_at__gte=week_ago)
            elif date_filter == 'month':
                month_ago = now - timedelta(days=30)
                queryset = queryset.filter(created_at__gte=month_ago)
            elif date_filter == 'year':
                year_ago = now - timedelta(days=365)
                queryset = queryset.filter(created_at__gte=year_ago)
        
        # Author filter
        author = self.request.GET.get('author')
        if author:
            queryset = queryset.filter(created_by__username__icontains=author)
        
        # Sort filter
        sort = self.request.GET.get('sort', '-created_at')
        if sort in ['created_at', '-created_at', 'title', '-title', '-updated_at', 'updated_at']:
            queryset = queryset.order_by(sort)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add filter parameters to context for form persistence
        context['current_search'] = self.request.GET.get('search', '')
        context['current_date'] = self.request.GET.get('date', '')
        context['current_author'] = self.request.GET.get('author', '')
        context['current_sort'] = self.request.GET.get('sort', '-created_at')
        # Get unique authors for filter dropdown
        context['authors'] = Article.objects.select_related('created_by').values_list(
            'created_by__username', flat=True
        ).distinct().order_by('created_by__username')
        return context


class ArticleDetailView(DetailView):
    model = Article
    template_name = 'articles/detail.html'
    context_object_name = 'article'


class ArticleCreateView(LoginRequiredMixin, StaffRequiredMixin, CreateView):
    model = Article
    form_class = ArticleForm
    template_name = 'articles/create.html'
    
    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Article created successfully!')
        return super().form_valid(form)


class ArticleUpdateView(LoginRequiredMixin, StaffRequiredMixin, UpdateView):
    model = Article
    form_class = ArticleForm
    template_name = 'articles/edit.html'
    
    def form_valid(self, form):
        messages.success(self.request, 'Article updated successfully!')
        return super().form_valid(form)


class ArticleDeleteView(LoginRequiredMixin, StaffRequiredMixin, DeleteView):
    model = Article
    template_name = 'articles/delete.html'
    success_url = reverse_lazy('articles:list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Article deleted successfully!')
        return super().delete(request, *args, **kwargs)
