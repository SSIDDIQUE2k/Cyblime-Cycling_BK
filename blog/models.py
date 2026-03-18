from django.db import models
from django.conf import settings
from django.urls import reverse
from django.utils import timezone


class BlogPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(
        upload_to='blog_images/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('blog:detail', kwargs={'pk': self.pk})
    
    @property
    def like_count(self):
        return self.likes.filter(is_like=True).count()
    
    @property
    def dislike_count(self):
        return self.likes.filter(is_like=False).count()
    
    def user_reaction(self, user):
        """Get user's reaction (like/dislike) to this post"""
        if user.is_authenticated:
            try:
                like = self.likes.get(user=user)
                return 'like' if like.is_like else 'dislike'
            except Like.DoesNotExist:
                pass
        return None


class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        null=True,
        blank=True
    )
    blog_post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField(max_length=500)
    
    # Fields for anonymous comments
    guest_name = models.CharField(max_length=100, blank=True, null=True)
    guest_email = models.EmailField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        if self.user:
            return f'Comment by {self.user.username} on {self.blog_post.title}'
        else:
            return f'Comment by {self.guest_name or "Anonymous"} on {self.blog_post.title}'
    
    @property
    def author_name(self):
        """Get the display name for the comment author"""
        if self.user:
            return self.user.get_full_name() or self.user.username
        return self.guest_name or 'Anonymous'
    
    @property
    def is_anonymous(self):
        """Check if this is an anonymous comment"""
        return self.user is None


class Like(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    blog_post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    is_like = models.BooleanField()  # True for like, False for dislike
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'blog_post')
    
    def __str__(self):
        action = 'liked' if self.is_like else 'disliked'
        return f'{self.user.username} {action} {self.blog_post.title}'
