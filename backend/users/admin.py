from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_name', 'is_staff', 'created_at')
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('display_name',)}),
    )
