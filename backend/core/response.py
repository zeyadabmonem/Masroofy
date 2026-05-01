from rest_framework.response import Response

def standard_response(success=True, data=None, message="", errors=None, status=200):
    return Response({
        "success": success,
        "data": data,
        "message": message,
        "errors": errors
    }, status=status)
