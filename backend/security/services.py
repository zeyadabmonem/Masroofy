import bcrypt
from .models import SecurityProfile
from users.models import UserProfile
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from core.exceptions import BusinessLogicException

class AuthService:
    @staticmethod
    def get_or_create_default_user():
        # For single-user MVP, grab the first user or create one
        user, _ = UserProfile.objects.get_or_create(username="default_user", defaults={"display_name": "My Wallet"})
        return user

    @staticmethod
    def setup_pin(pin: str) -> dict:
        user = AuthService.get_or_create_default_user()
        profile, _ = SecurityProfile.objects.get_or_create(user=user)
        
        if profile.pin_hash:
            raise BusinessLogicException("PIN is already set up.")
            
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pin.encode('utf-8'), salt)
        
        profile.pin_hash = hashed.decode('utf-8')
        profile.lock_enabled = True
        profile.save()
        
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }

    @staticmethod
    def verify_pin(pin: str) -> dict:
        user = AuthService.get_or_create_default_user()
        try:
            profile = SecurityProfile.objects.get(user=user)
        except SecurityProfile.DoesNotExist:
            raise BusinessLogicException("Security profile not found. Please setup PIN first.")

        if not profile.pin_hash:
            raise BusinessLogicException("PIN not set up.")

        # Check lockout
        if profile.failed_attempts >= settings.MAX_PIN_ATTEMPTS:
            if profile.last_failed_attempt:
                lockout_time = profile.last_failed_attempt + timedelta(minutes=settings.PIN_LOCKOUT_MINUTES)
                if timezone.now() < lockout_time:
                    raise BusinessLogicException("Account locked due to too many failed attempts. Try again later.")
                else:
                    # Reset after timeout
                    profile.failed_attempts = 0
                    profile.save()

        if bcrypt.checkpw(pin.encode('utf-8'), profile.pin_hash.encode('utf-8')):
            profile.failed_attempts = 0
            profile.save()
            refresh = RefreshToken.for_user(user)
            return {
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
        else:
            profile.failed_attempts += 1
            profile.last_failed_attempt = timezone.now()
            profile.save()
            raise BusinessLogicException("Invalid PIN.")

    @staticmethod
    def change_pin(user, old_pin: str, new_pin: str) -> dict:
        try:
            profile = SecurityProfile.objects.get(user=user)
        except SecurityProfile.DoesNotExist:
            raise BusinessLogicException("Security profile not found.")
            
        if not bcrypt.checkpw(old_pin.encode('utf-8'), profile.pin_hash.encode('utf-8')):
            raise BusinessLogicException("Invalid old PIN.")
            
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(new_pin.encode('utf-8'), salt)
        
        profile.pin_hash = hashed.decode('utf-8')
        profile.save()
        
        return {"message": "PIN changed successfully."}
