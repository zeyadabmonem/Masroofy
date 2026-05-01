from rest_framework import serializers
from .models import NotificationLog

class NotificationLogSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)

    class Meta:
        model = NotificationLog
        fields = ['id', 'notification_type', 'notification_type_display', 'message', 'is_dismissed', 'created_at']
        read_only_fields = ['id', 'notification_type_display', 'created_at']
