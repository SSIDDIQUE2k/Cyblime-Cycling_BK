from django.contrib import admin
from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_by', 'uploaded_at')
    list_filter = ('uploaded_at', 'uploaded_by')
    search_fields = ('title', 'description')
    date_hierarchy = 'uploaded_at'
    
    # Exclude uploaded_by from the form since it's set automatically
    exclude = ('uploaded_by',)
    
    # Make uploaded_at readonly since it's auto-generated
    readonly_fields = ('uploaded_at',)
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
