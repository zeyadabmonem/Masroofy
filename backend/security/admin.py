from django.contrib import admin
from .models import SecurityProfile

@admin.register(SecurityProfile)
class SecurityProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'lock_enabled', 'failed_attempts', 'updated_at')
    search_fields = ('user__username',)
