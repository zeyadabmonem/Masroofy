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
        """
        Determines the current status of a budget cycle based on today's date.
        
        Args:
            cycle (BudgetCycle): The budget cycle to check.
            
        Returns:
            str: One of 'PENDING', 'ACTIVE', or 'EXPIRED'.
        """
        today = date.today()
        if today < cycle.start_date:
            return DailyLimitEngine.CYCLE_PENDING
        if today > cycle.end_date:
            return DailyLimitEngine.CYCLE_EXPIRED
        return DailyLimitEngine.CYCLE_ACTIVE

    @staticmethod
    def remaining_days_inclusive(end_date) -> int:
        """
        Calculates days from today to end_date, inclusive of today.
        
        Args:
            end_date (date): The cycle's end date.
            
        Returns:
            int: Remaining days count (minimum 0).
        """
        today = date.today()
        delta = (end_date - today).days + 1
        return max(delta, 0)

    @staticmethod
    def total_days_inclusive(start_date, end_date) -> int:
        """
        Calculates total calendar days in the cycle, inclusive of both endpoints.
        
        Args:
            start_date (date): The cycle's start date.
            end_date (date): The cycle's end date.
            
        Returns:
            int: Total days count.
        """
        delta = (end_date - start_date).days + 1
        return max(delta, 0)

    @staticmethod
    def _get_total_spent(cycle: BudgetCycle) -> Decimal:
        """
        Aggregates the sum of all transaction amounts for a specific cycle.
        
        Args:
            cycle (BudgetCycle): The cycle to aggregate transactions for.
            
        Returns:
            Decimal: Total spent amount, quantized to 2 decimal places.
        """
        result = Transaction.objects.filter(cycle=cycle).aggregate(total=Sum("amount"))
        return (result["total"] or Decimal("0.00")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def compute_daily_limit(remaining_balance: Decimal, remaining_days: int) -> Decimal:
        """
        Computes the safe daily limit.
        
        Logic:
        - If no remaining days -> 0 (cycle expired)
        - If balance is negative -> 0 (overspent)
        - Otherwise -> remaining_balance / remaining_days
        
        Args:
            remaining_balance (Decimal): Money left in the budget.
            remaining_days (int): Days left in the cycle.
            
        Returns:
            Decimal: The safe daily limit amount.
        """
        if remaining_days <= 0:
            return Decimal("0.00")
        if remaining_balance <= 0:
            return Decimal("0.00")
        limit = remaining_balance / remaining_days
        return limit.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def calculate(cycle: BudgetCycle) -> dict:
        """
        Performs a full calculation of all budget metrics for a given cycle.
        
        Args:
            cycle (BudgetCycle): The cycle to calculate for.
            
        Returns:
            dict: A dictionary containing:
                - total_allowance (Decimal)
                - total_spent (Decimal)
                - remaining_balance (Decimal)
                - remaining_days (int)
                - total_days (int)
                - days_elapsed (int)
                - safe_daily_limit (Decimal)
                - spending_percentage (Decimal)
                - alert_level (str)
                - cycle_status (str)
        """
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
    """
    Service layer for budget cycle management.
    """

    @staticmethod
    def create_cycle(user, data: dict) -> BudgetCycle:
        """
        Deactivates all existing active cycles and creates a fresh one.
        
        Args:
            user (User): The user owning the cycle.
            data (dict): Dictionary containing total_allowance, start_date, and end_date.
            
        Returns:
            BudgetCycle: The newly created cycle object.
        """
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
        """
        Retrieves the current active budget cycle for a user.
        
        Args:
            user (User): The user to query.
            
        Returns:
            BudgetCycle: The active cycle.
            
        Raises:
            ResourceNotFoundException: If no active cycle is found.
        """
        try:
            return BudgetCycle.objects.get(user=user, is_active=True)
        except BudgetCycle.DoesNotExist:
            raise ResourceNotFoundException("No active budget cycle found.")

    @staticmethod
    def get_cycle_summary(cycle: BudgetCycle) -> dict:
        """
        Gets a calculated summary for a cycle.
        
        Args:
            cycle (BudgetCycle): The cycle to summarize.
            
        Returns:
            dict: The calculated metrics dictionary.
        """
        return DailyLimitEngine.calculate(cycle)

    @staticmethod
    def reset_cycle(cycle: BudgetCycle) -> None:
        """
        Deactivates a cycle while preserving transaction history.
        
        Args:
            cycle (BudgetCycle): The cycle to reset.
        """
        cycle.is_active = False
        cycle.save()

