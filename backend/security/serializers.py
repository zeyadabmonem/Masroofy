from rest_framework import serializers

class PINSerializer(serializers.Serializer):
    pin = serializers.CharField(max_length=6, min_length=4)

class PINChangeSerializer(serializers.Serializer):
    old_pin = serializers.CharField(max_length=6, min_length=4)
    new_pin = serializers.CharField(max_length=6, min_length=4)

