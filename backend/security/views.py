from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from core.response import standard_response
from .serializers import PINSerializer, PINChangeSerializer
from .services import AuthService
from .models import SecurityProfile

class PINSetupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PINSerializer(data=request.data)
        if serializer.is_valid():
            data = AuthService.setup_pin(serializer.validated_data['pin'])
            return standard_response(message="PIN setup successfully.", data=data)
        return standard_response(success=False, message="Validation failed", errors=serializer.errors, status=400)

class PINVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PINSerializer(data=request.data)
        if serializer.is_valid():
            data = AuthService.verify_pin(serializer.validated_data['pin'])
            return standard_response(message="PIN verified successfully.", data=data)
        return standard_response(success=False, message="Validation failed", errors=serializer.errors, status=400)

class PINChangeView(APIView):
    def post(self, request):
        serializer = PINChangeSerializer(data=request.data)
        if serializer.is_valid():
            data = AuthService.change_pin(request.user, serializer.validated_data['old_pin'], serializer.validated_data['new_pin'])
            return standard_response(message="PIN changed successfully.", data=data)
        return standard_response(success=False, message="Validation failed", errors=serializer.errors, status=400)

class PINStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = AuthService.get_or_create_default_user()
        try:
            profile = SecurityProfile.objects.get(user=user)
            has_pin = bool(profile.pin_hash)
        except SecurityProfile.DoesNotExist:
            has_pin = False
            
        return standard_response(data={"has_pin": has_pin})
