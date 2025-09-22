from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.contrib import messages
from django.db import IntegrityError
from django.core.exceptions import PermissionDenied
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
        return BlogPost.objects.select_related('author').prefetch_related('comments', 'likes')


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
