from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from core.response import standard_response
from .serializers import PINSerializer
from .services import AuthService

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
