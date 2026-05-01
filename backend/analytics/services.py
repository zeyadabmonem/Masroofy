from decimal import Decimal
from django.db.models import Sum
from transactions.models import Transaction
from budgets.models import BudgetCycle
from budgets.services import DailyLimitEngine
from datetime import date, timedelta


class AnalyticsService:
    @staticmethod
    def get_dashboard_summary(cycle: BudgetCycle) -> dict:
        """Aggregated data for the main dashboard."""
        return DailyLimitEngine.calculate(cycle)

    @staticmethod
    def get_category_breakdown(cycle: BudgetCycle) -> list:
        """Returns per-category spending totals for pie chart."""
        from transactions.models import Transaction
        results = (
            Transaction.objects
            .filter(cycle=cycle)
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )
        return [
            {
                'category': row['category'],
                'total': row['total'],
            }
            for row in results
        ]

    @staticmethod
    def get_daily_spending(cycle: BudgetCycle) -> list:
        """Returns daily spending totals for the bar chart (last 30 days)."""
        today = date.today()
        start = max(cycle.start_date, today - timedelta(days=29))
        results = (
            Transaction.objects
            .filter(cycle=cycle, created_at__date__gte=start)
            .values('created_at__date')
            .annotate(total=Sum('amount'))
            .order_by('created_at__date')
        )
        return [
            {
                'date': str(row['created_at__date']),
                'total': row['total'],
            }
            for row in results
        ]
