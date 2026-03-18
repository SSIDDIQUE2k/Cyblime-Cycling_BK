from django.db import models
from django.conf import settings
from django.urls import reverse


class Photo(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery_photos/')
    description = models.TextField(
        blank=True,
        help_text="Optional description of the photo"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='photos'
    )
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('gallery:list')
