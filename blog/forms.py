from django import forms
from .models import BlogPost, Comment


class BlogPostForm(forms.ModelForm):
    class Meta:
        model = BlogPost
        fields = ('title', 'content', 'image')
        widgets = {
            'content': forms.Textarea(attrs={'rows': 8}),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Add a comment...',
                'class': 'comment-textarea'
            }),
        }


class AnonymousCommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('content', 'guest_name', 'guest_email')
        widgets = {
            'content': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Add a comment...',
                'class': 'comment-textarea'
            }),
            'guest_name': forms.TextInput(attrs={
                'placeholder': 'Your name (optional)',
                'class': 'guest-name-input'
            }),
            'guest_email': forms.EmailInput(attrs={
                'placeholder': 'Your email (optional)',
                'class': 'guest-email-input'
            }),
        }
