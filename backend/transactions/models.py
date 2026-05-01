from django.db import models
from budgets.models import BudgetCycle
from core.constants import EXPENSE_CATEGORIES

class Transaction(models.Model):
    cycle = models.ForeignKey(BudgetCycle, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES, default='OTHER')
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.amount} - {self.get_category_display()} ({self.created_at.date()})"
