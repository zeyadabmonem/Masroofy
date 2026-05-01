from django.db import transaction
from core.exceptions import BusinessLogicException

class BaseService:
    """
    Base class for all business services.
    Provides common utilities for transaction handling and error management.
    """
    @staticmethod
    def atomic_transaction(func):
        """Decorator to wrap a service method in a database transaction."""
        def wrapper(*args, **kwargs):
            with transaction.atomic():
                return func(*args, **kwargs)
        return wrapper

    @staticmethod
    def validate_presence(obj, name="Resource"):
        """Utility to ensure an object exists, otherwise raises an exception."""
        if not obj:
            raise BusinessLogicException(f"{name} not found.")
        return obj
