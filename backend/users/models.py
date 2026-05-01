from django.contrib.auth.models import AbstractUser
from django.db import models

class UserProfile(AbstractUser):
    display_name = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username or self.display_name or f"User {self.pk}"
