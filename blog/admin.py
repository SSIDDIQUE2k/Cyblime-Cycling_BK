from django.contrib import admin
from .models import BlogPost, Comment, Like


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'author')
    search_fields = ('title', 'content', 'author__username')
    prepopulated_fields = {}
    date_hierarchy = 'created_at'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'blog_post', 'created_at', 'content_preview')
    list_filter = ('created_at', 'user', 'blog_post')
    search_fields = ('content', 'user__username', 'blog_post__title')
    date_hierarchy = 'created_at'
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'blog_post', 'is_like', 'created_at')
    list_filter = ('is_like', 'created_at', 'user')
    search_fields = ('user__username', 'blog_post__title')
    date_hierarchy = 'created_at'
