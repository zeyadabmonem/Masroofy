from django.contrib import admin
from .models import NotificationLog

@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('cycle', 'notification_type', 'is_dismissed', 'created_at')
    list_filter = ('notification_type', 'is_dismissed', 'created_at')
