from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from datetime import date

class BudgetCycle(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budget_cycles')
    total_allowance = models.DecimalField(max_digits=12, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def clean(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError("End date must be after start date.")
            
        if self.is_active:
            # Check if there's already an active budget for this user
            active_budgets = BudgetCycle.objects.filter(user=self.user, is_active=True)
            if self.pk:
                active_budgets = active_budgets.exclude(pk=self.pk)
            if active_budgets.exists():
                raise ValidationError("Only one budget cycle can be active at a time.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.start_date} to {self.end_date}"
