from django.db import models
from django.conf import settings

class SecurityProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='security_profile')
    pin_hash = models.CharField(max_length=128, blank=True, null=True)
    lock_enabled = models.BooleanField(default=False)
    failed_attempts = models.IntegerField(default=0)
    last_failed_attempt = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Security Profile - {self.user.username}"
