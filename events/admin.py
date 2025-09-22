from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'created_by', 'created_at')
    list_filter = ('date', 'created_at', 'created_by')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'date'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
