from rest_framework.views import APIView
from core.response import standard_response
from budgets.services import BudgetService
from .services import AnalyticsService


class DashboardSummaryView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        data = AnalyticsService.get_dashboard_summary(cycle)
        return standard_response(data=data)


class CategoryBreakdownView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        data = AnalyticsService.get_category_breakdown(cycle)
        return standard_response(data=data)


class DailySpendingView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        data = AnalyticsService.get_daily_spending(cycle)
        return standard_response(data=data)
