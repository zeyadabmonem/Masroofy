from django.urls import path
from .views import BudgetCycleListCreateView, ActiveBudgetCycleView, BudgetCycleResetView

urlpatterns = [
    path('', BudgetCycleListCreateView.as_view(), name='budget-list-create'),
    path('active/', ActiveBudgetCycleView.as_view(), name='budget-active'),
    path('<int:pk>/reset/', BudgetCycleResetView.as_view(), name='budget-reset'),
]
