from django.contrib import admin
from .models import BudgetCycle

@admin.register(BudgetCycle)
class BudgetCycleAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_allowance', 'start_date', 'end_date', 'is_active', 'created_at')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('user__username', 'user__email')
