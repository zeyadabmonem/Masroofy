from rest_framework import serializers

class PINSerializer(serializers.Serializer):
    pin = serializers.CharField(max_length=6, min_length=4)
