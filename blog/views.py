from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.contrib import messages
from django.db import IntegrityError
from django.core.exceptions import PermissionDenied
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
from .models import BlogPost, Comment, Like
from .forms import BlogPostForm, CommentForm


class UserOwnsPostMixin:
    """Mixin to ensure user can only edit/delete their own posts (or staff can edit any)"""
    def get_object(self):
        obj = super().get_object()
        if not (self.request.user == obj.author or self.request.user.is_staff):
            raise PermissionDenied("You don't have permission to modify this post")
        return obj


class BlogListView(LoginRequiredMixin, ListView):
    model = BlogPost
    template_name = 'blog/list.html'
    context_object_name = 'posts'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = BlogPost.objects.select_related('author').prefetch_related('comments', 'likes')
        
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
            queryset = queryset.filter(author__username__icontains=author)
        
        # Sort filter
        sort = self.request.GET.get('sort', '-created_at')
        if sort == 'popular':
            queryset = queryset.annotate(
                like_count=Count('likes', filter=Q(likes__is_like=True))
            ).order_by('-like_count', '-created_at')
        elif sort in ['created_at', '-created_at', 'title', '-title']:
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
        context['authors'] = BlogPost.objects.select_related('author').values_list(
            'author__username', flat=True
        ).distinct().order_by('author__username')
        return context


class BlogDetailView(LoginRequiredMixin, DetailView):
    model = BlogPost
    template_name = 'blog/detail.html'
    context_object_name = 'post'
    
    def get_queryset(self):
        return BlogPost.objects.select_related('author').prefetch_related(
            'comments__user', 'likes'
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comment_form'] = CommentForm()
        context['user_reaction'] = self.object.user_reaction(self.request.user)
        return context


class BlogCreateView(LoginRequiredMixin, CreateView):
    model = BlogPost
    form_class = BlogPostForm
    template_name = 'blog/create.html'
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, 'Blog post created successfully!')
        return super().form_valid(form)


class BlogUpdateView(LoginRequiredMixin, UserOwnsPostMixin, UpdateView):
    model = BlogPost
    form_class = BlogPostForm
    template_name = 'blog/edit.html'
    
    def form_valid(self, form):
        messages.success(self.request, 'Blog post updated successfully!')
        return super().form_valid(form)


class BlogDeleteView(LoginRequiredMixin, UserOwnsPostMixin, DeleteView):
    model = BlogPost
    template_name = 'blog/delete.html'
    success_url = reverse_lazy('blog:list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Blog post deleted successfully!')
        return super().delete(request, *args, **kwargs)


class BlogLikeView(LoginRequiredMixin, View):
    def post(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        action = request.POST.get('action')  # 'like', 'dislike', or 'remove'
        
        # Remove existing like/dislike
        Like.objects.filter(user=request.user, blog_post=post).delete()
        
        # Add new reaction if not removing
        if action in ['like', 'dislike']:
            Like.objects.create(
                user=request.user,
                blog_post=post,
                is_like=(action == 'like')
            )
        
        return JsonResponse({
            'likes': post.like_count,
            'dislikes': post.dislike_count,
            'user_reaction': post.user_reaction(request.user)
        })


class CommentCreateView(LoginRequiredMixin, View):
    def post(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        form = CommentForm(request.POST)
        
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.blog_post = post
            comment.save()
            
            return JsonResponse({
                'success': True,
                'comment': {
                    'id': comment.id,
                    'content': comment.content,
                    'user': comment.user.username,
                    'created_at': comment.created_at.strftime('%B %d, %Y at %I:%M %p')
                }
            })
        
        return JsonResponse({'success': False, 'errors': form.errors})


class CommentDeleteView(LoginRequiredMixin, DeleteView):
    model = Comment
    
    def get_object(self):
        obj = super().get_object()
        if not (self.request.user == obj.user or self.request.user.is_staff):
            raise PermissionDenied("You don't have permission to delete this comment")
        return obj
    
    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        post_pk = comment.blog_post.pk
        comment.delete()
        return JsonResponse({'success': True})
