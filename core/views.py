from django.views.generic import TemplateView
from django.utils import timezone
from blog.models import BlogPost
from events.models import Event
from articles.models import Article
from gallery.models import Photo
from .models import SlideshowImage, SiteSetting


class HomeView(TemplateView):
    template_name = 'core/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Get recent content for the home page
        context['recent_posts'] = BlogPost.objects.select_related('author')[:3]
        context['upcoming_events'] = Event.objects.filter(date__gte=timezone.now())[:3]
        context['recent_articles'] = Article.objects.select_related('created_by')[:3]
        context['recent_photos'] = Photo.objects.select_related('uploaded_by')[:6]
        
        # Get slideshow images and site settings
        context['slideshow_images'] = SlideshowImage.objects.filter(is_active=True).order_by('order')[:5]
        site_settings, created = SiteSetting.objects.get_or_create()
        context['site_settings'] = site_settings
        
        return context


class AboutView(TemplateView):
    template_name = 'core/about.html'


# Note: Material admin portal views removed - using Django admin at /admin/admindashboard/ instead
