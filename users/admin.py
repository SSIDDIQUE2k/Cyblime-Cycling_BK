from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('profile_picture', 'bio')
        }),
    )
    list_display = BaseUserAdmin.list_display + ('date_joined', 'is_staff')
    list_filter = BaseUserAdmin.list_filter + ('date_joined',)
