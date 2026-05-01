from decimal import Decimal
from datetime import date
from django.db.models import Sum
from budgets.models import BudgetCycle
from transactions.models import Transaction
from core.exceptions import BusinessLogicException, ResourceNotFoundException


class DailyLimitEngine:
    """
    Calculates the safe daily spending limit.
    Formula: remaining_balance / remaining_days
    """

    @staticmethod
    def calculate(cycle: BudgetCycle) -> dict:
        today = date.today()
        total_spent = DailyLimitEngine._get_total_spent(cycle)
        remaining_balance = Decimal(str(cycle.total_allowance)) - total_spent
        remaining_days = (cycle.end_date - today).days + 1

        if remaining_days <= 0:
            remaining_days = 0
            daily_limit = Decimal("0.00")
        else:
            daily_limit = remaining_balance / remaining_days

        total_days = (cycle.end_date - cycle.start_date).days + 1
        days_elapsed = (today - cycle.start_date).days
        spending_percentage = (
            (total_spent / Decimal(str(cycle.total_allowance)) * 100)
            if cycle.total_allowance > 0
            else Decimal("0.00")
        )

        return {
            "total_allowance": cycle.total_allowance,
            "total_spent": total_spent,
            "remaining_balance": remaining_balance,
            "remaining_days": remaining_days,
            "total_days": total_days,
            "days_elapsed": days_elapsed,
            "safe_daily_limit": daily_limit,
            "spending_percentage": round(spending_percentage, 2),
        }

    @staticmethod
    def _get_total_spent(cycle: BudgetCycle) -> Decimal:
        result = Transaction.objects.filter(cycle=cycle).aggregate(total=Sum("amount"))
        return result["total"] or Decimal("0.00")


class BudgetService:
    @staticmethod
    def create_cycle(user, data: dict) -> BudgetCycle:
        # Deactivate any existing active cycle before creating a new one
        BudgetCycle.objects.filter(user=user, is_active=True).update(is_active=False)
        cycle = BudgetCycle.objects.create(
            user=user,
            total_allowance=data["total_allowance"],
            start_date=data["start_date"],
            end_date=data["end_date"],
            is_active=True,
        )
        return cycle

    @staticmethod
    def get_active_cycle(user) -> BudgetCycle:
        try:
            return BudgetCycle.objects.get(user=user, is_active=True)
        except BudgetCycle.DoesNotExist:
            raise ResourceNotFoundException("No active budget cycle found.")

    @staticmethod
    def get_cycle_summary(cycle: BudgetCycle) -> dict:
        return DailyLimitEngine.calculate(cycle)

    @staticmethod
    def reset_cycle(cycle: BudgetCycle) -> None:
        """Safely deactivate a cycle (marks as inactive; history preserved)."""
        cycle.is_active = False
        cycle.save()
