from rest_framework.exceptions import APIException

class BusinessLogicException(APIException):
    status_code = 400
    default_detail = 'A business logic error occurred.'
    default_code = 'business_error'

class ResourceNotFoundException(APIException):
    status_code = 404
    default_detail = 'The requested resource was not found.'
    default_code = 'not_found'
