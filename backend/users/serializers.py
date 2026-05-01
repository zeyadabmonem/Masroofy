from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'display_name', 'email', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']
