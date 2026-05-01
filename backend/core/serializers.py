from rest_framework import serializers

class BaseModelSerializer(serializers.ModelSerializer):
    """
    Base serializer that includes common logic for all models.
    """
    def to_representation(self, instance):
        """
        Removes null fields from the output for a cleaner API response.
        """
        ret = super().to_representation(instance)
        return {key: value for key, value in ret.items() if value is not None}

class TimestampSerializerMixin(serializers.Serializer):
    """
    Mixin to add created_at and updated_at fields consistently.
    """
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
