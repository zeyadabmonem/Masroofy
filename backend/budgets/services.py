from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from django.db.models import Sum
from budgets.models import BudgetCycle
from transactions.models import Transaction
from core.exceptions import BusinessLogicException, ResourceNotFoundException
from core.constants import BUDGET_THRESHOLD_WARNING


class DailyLimitEngine:
    """
    Authoritative calculation engine for all Masroofy financial metrics.

    Formula: safe_daily_limit = remaining_balance / remaining_days

    Edge cases handled:
      - Cycle not started yet (PENDING)
      - Cycle expired (EXPIRED)
      - Negative balance (overspending)
      - Zero-allowance cycles
      - Last day of cycle (remaining_days = 1)
      - Spending exactly at 100%
    """

    CYCLE_PENDING = 'PENDING'
    CYCLE_ACTIVE = 'ACTIVE'
    CYCLE_EXPIRED = 'EXPIRED'

    @staticmethod
    def get_cycle_status(cycle: BudgetCycle) -> str:
        today = date.today()
        if today < cycle.start_date:
            return DailyLimitEngine.CYCLE_PENDING
        if today > cycle.end_date:
            return DailyLimitEngine.CYCLE_EXPIRED
        return DailyLimitEngine.CYCLE_ACTIVE

    @staticmethod
    def remaining_days_inclusive(end_date) -> int:
        """Days from today to end_date, inclusive of today. Min = 0."""
        today = date.today()
        delta = (end_date - today).days + 1
        return max(delta, 0)

    @staticmethod
    def total_days_inclusive(start_date, end_date) -> int:
        """Total calendar days in the cycle, inclusive of both endpoints."""
        delta = (end_date - start_date).days + 1
        return max(delta, 0)

    @staticmethod
    def _get_total_spent(cycle: BudgetCycle) -> Decimal:
        result = Transaction.objects.filter(cycle=cycle).aggregate(total=Sum("amount"))
        return (result["total"] or Decimal("0.00")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def compute_daily_limit(remaining_balance: Decimal, remaining_days: int) -> Decimal:
        """
        Computes the safe daily limit.
        - If no remaining days → 0 (cycle expired)
        - If balance is negative → 0 (overspent, cannot carry negative limit)
        - If last day → remaining_balance (spend it all today)
        """
        if remaining_days <= 0:
            return Decimal("0.00")
        if remaining_balance <= 0:
            return Decimal("0.00")
        limit = remaining_balance / remaining_days
        return limit.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def calculate(cycle: BudgetCycle) -> dict:
        today = date.today()
        status = DailyLimitEngine.get_cycle_status(cycle)
        total_allowance = Decimal(str(cycle.total_allowance))
        total_spent = DailyLimitEngine._get_total_spent(cycle)
        remaining_balance = total_allowance - total_spent

        total_days = DailyLimitEngine.total_days_inclusive(cycle.start_date, cycle.end_date)

        if status == DailyLimitEngine.CYCLE_ACTIVE:
            remaining_days = DailyLimitEngine.remaining_days_inclusive(cycle.end_date)
        else:
            remaining_days = 0

        days_elapsed = total_days - remaining_days

        safe_daily_limit = DailyLimitEngine.compute_daily_limit(remaining_balance, remaining_days)

        spending_percentage = (
            (total_spent / total_allowance * 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            if total_allowance > 0
            else Decimal("0.00")
        )
        # Cap at 100 for display; negative balance can push this over 100
        capped_percentage = min(spending_percentage, Decimal("100.00"))

        # Alert level
        if total_spent >= total_allowance:
            alert_level = 'EXHAUSTED'
        elif spending_percentage >= BUDGET_THRESHOLD_WARNING * 100:
            alert_level = 'WARNING'
        else:
            alert_level = 'NONE'

        return {
            "total_allowance": total_allowance,
            "total_spent": total_spent,
            "remaining_balance": remaining_balance,
            "remaining_days": remaining_days,
            "total_days": total_days,
            "days_elapsed": days_elapsed,
            "safe_daily_limit": safe_daily_limit,
            "spending_percentage": capped_percentage,
            "alert_level": alert_level,
            "cycle_status": status,
        }


class BudgetService:
    @staticmethod
    def create_cycle(user, data: dict) -> BudgetCycle:
        """Deactivates all existing active cycles, then creates a fresh one."""
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
        """Safely archives a cycle (marks inactive; all transaction history preserved)."""
        cycle.is_active = False
        cycle.save()
