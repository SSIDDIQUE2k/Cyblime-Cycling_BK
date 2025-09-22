from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import SlideshowImage, SiteSetting

# Register models
@admin.register(SlideshowImage)
class SlideshowImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'caption']
    ordering = ['order']

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'main_title', 'subtitle', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one site setting
        return not SiteSetting.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of site settings
        return False

# Customize the default Django admin site
admin.site.site_header = "🛡️ CyBlime Cycling - Admin Dashboard"
admin.site.site_title = "CyBlime Admin"
admin.site.index_title = "🏆 CyBlime Cycling Administration"

# Override the default admin index template context
original_index = admin.site.index

def custom_index(request, extra_context=None):
    """
    Add security warning to admin index
    """
    extra_context = extra_context or {}
    extra_context.update({
        'security_warning': mark_safe("""
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0; color: #856404;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 2em; margin-right: 15px;">⚠️</span>
                    <div>
                        <h3 style="margin: 0; color: #856404; font-size: 1.4em;">CYBLIME CYCLING ADMIN DASHBOARD</h3>
                        <p style="margin: 5px 0 0 0; font-weight: bold;">Direct Database Access - Admin Users Only</p>
                    </div>
                </div>
                <div style="border-top: 1px solid #ffc107; padding-top: 15px; margin-top: 15px;">
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                        <li><strong>All actions are logged and monitored</strong></li>
                        <li><strong>Changes made here directly affect the live database</strong></li>
                        <li><strong>Use the User Dashboard for routine content management</strong></li>
                        <li><strong>Only authorized admin/staff users should access this interface</strong></li>
                    </ul>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
                        <strong>📊 Alternative:</strong> 
                        <a href="/dashboard/" style="color: #856404; text-decoration: underline;">
                            Use User Dashboard for content management
                        </a>
                    </div>
                </div>
            </div>
        """)
    })
    return original_index(request, extra_context)

# Replace the admin site index method
admin.site.index = custom_index
