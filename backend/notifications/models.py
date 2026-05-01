from django.db import models
from budgets.models import BudgetCycle

class NotificationLog(models.Model):
    TYPE_CHOICES = [
        ('WARNING_80', '80% Budget Used'),
        ('EXHAUSTED', 'Budget Exhausted'),
        ('SYSTEM', 'System Alert'),
    ]

    cycle = models.ForeignKey(BudgetCycle, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.CharField(max_length=255)
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.message}"
