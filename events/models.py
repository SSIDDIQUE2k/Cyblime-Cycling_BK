from django.db import models
from django.conf import settings
from django.urls import reverse
from django.utils import timezone


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateTimeField()
    image = models.ImageField(
        upload_to='event_images/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='events'
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='events_joined',
        blank=True,
        help_text='Users who have joined this event'
    )
    
    class Meta:
        ordering = ['date']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('events:detail', kwargs={'pk': self.pk})
    
    @property
    def is_past_event(self):
        return timezone.now() > self.date
