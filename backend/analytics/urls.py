from django.urls import path
from .views import DashboardSummaryView, CategoryBreakdownView, DailySpendingView

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='analytics-summary'),
    path('category-breakdown/', CategoryBreakdownView.as_view(), name='analytics-categories'),
    path('daily-spending/', DailySpendingView.as_view(), name='analytics-daily'),
]
