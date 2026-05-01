from rest_framework.views import APIView
from rest_framework import generics
from core.response import standard_response
from core.exceptions import BusinessLogicException, ResourceNotFoundException
from .serializers import BudgetCycleSerializer, BudgetSummarySerializer
from .services import BudgetService
from .models import BudgetCycle


class BudgetCycleListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetCycleSerializer

    def get_queryset(self):
        return BudgetCycle.objects.filter(user=self.request.user).order_by('-start_date')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            cycle = BudgetService.create_cycle(request.user, serializer.validated_data)
            return standard_response(
                message="Budget cycle created successfully.",
                data=BudgetCycleSerializer(cycle).data,
                status=201
            )
        return standard_response(success=False, message="Validation failed.", errors=serializer.errors, status=400)


class ActiveBudgetCycleView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        cycle_data = BudgetCycleSerializer(cycle).data
        summary = BudgetService.get_cycle_summary(cycle)
        return standard_response(data={**cycle_data, "summary": summary})


class BudgetCycleResetView(APIView):
    def delete(self, request, pk):
        try:
            cycle = BudgetCycle.objects.get(pk=pk, user=request.user)
        except BudgetCycle.DoesNotExist:
            raise ResourceNotFoundException("Budget cycle not found.")
        BudgetService.reset_cycle(cycle)
        return standard_response(message="Budget cycle reset successfully.")
