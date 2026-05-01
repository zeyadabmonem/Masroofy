from django.db import models
from budgets.models import BudgetCycle

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food & Dining'),
        ('TRANSPORT', 'Transportation'),
        ('SHOPPING', 'Shopping'),
        ('BILLS', 'Bills & Utilities'),
        ('ENTERTAINMENT', 'Entertainment'),
        ('EDUCATION', 'Education'),
        ('OTHER', 'Other'),
    ]

    cycle = models.ForeignKey(BudgetCycle, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.amount} - {self.get_category_display()} ({self.created_at.date()})"
