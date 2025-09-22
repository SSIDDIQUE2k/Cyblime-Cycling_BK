from django.db import models
from django.core.validators import URLValidator

class SlideshowImage(models.Model):
    """
    Model for managing slideshow images on the landing page
    """
    title = models.CharField(max_length=200, help_text="Image title/description")
    image_url = models.URLField(
        max_length=500, 
        validators=[URLValidator()],
        help_text="URL of the image (e.g., from unsplash, pexels, etc.)",
        default="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    )
    caption = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Optional caption text"
    )
    is_active = models.BooleanField(default=True, help_text="Show this image in slideshow")
    order = models.PositiveIntegerField(default=0, help_text="Display order (0 = first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Slideshow Image"
        verbose_name_plural = "Slideshow Images"
    
    def __str__(self):
        return f"{self.title} (Order: {self.order})"

class SiteSetting(models.Model):
    """
    General site settings
    """
    site_title = models.CharField(max_length=100, default="Cyblime-Cycling")
    main_title = models.CharField(max_length=50, default="CYBLIME")
    subtitle = models.CharField(max_length=100, default="BROOKLYN CYBLIME CYCLING CLUB")
    hero_background = models.URLField(
        max_length=500,
        default="https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        help_text="Background image for hero section"
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return self.site_title
    
    def save(self, *args, **kwargs):
        # Ensure only one settings record exists
        if not self.pk and SiteSetting.objects.exists():
            raise ValueError('Only one SiteSetting instance is allowed')
        return super().save(*args, **kwargs)
