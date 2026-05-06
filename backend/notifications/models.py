from django.db import models
from budgets.models import BudgetCycle
from core.constants import NOTIFICATION_TYPES

class NotificationLog(models.Model):
    cycle = models.ForeignKey(BudgetCycle, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.CharField(max_length=255)
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.message}"
