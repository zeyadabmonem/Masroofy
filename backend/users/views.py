from rest_framework.views import APIView
from core.response import standard_response
from .serializers import UserProfileSerializer

class MeView(APIView):
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return standard_response(data=serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return standard_response(message="Profile updated.", data=serializer.data)
        return standard_response(success=False, message="Validation failed.", errors=serializer.errors, status=400)
