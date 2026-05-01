import logging
from django.http import JsonResponse
from rest_framework.views import exception_handler
from rest_framework import status
from core.response import standard_response

logger = logging.getLogger(__name__)

class APIExceptionHandlerMiddleware:
    """
    Middleware to catch exceptions and return standardized JSON responses.
    This works alongside DRF's exception handler.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        # We handle DRF exceptions via the DRF exception_handler in views,
        # but this catches anything that escapes or happens outside views.
        
        logger.error(f"Unhandled exception: {str(exception)}", exc_info=True)
        
        return JsonResponse({
            "success": False,
            "data": None,
            "message": "An internal server error occurred.",
            "errors": {"server": [str(exception)] if request.debug else ["Please contact support."]}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def custom_exception_handler(exc, context):
    """
    Custom exception handler for Django REST Framework.
    Standardizes the error format to match our response envelope.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Standardize the response data
        custom_data = {
            "success": False,
            "data": None,
            "message": "An error occurred.",
            "errors": response.data
        }
        
        # Handle different detail formats
        if isinstance(response.data, dict) and 'detail' in response.data:
            custom_data['message'] = response.data['detail']
            del response.data['detail']
            
        response.data = custom_data

    return response
