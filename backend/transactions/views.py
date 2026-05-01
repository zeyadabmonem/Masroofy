from rest_framework.views import APIView
from rest_framework import status
from core.response import standard_response
from core.exceptions import ResourceNotFoundException
from budgets.services import BudgetService
from .serializers import TransactionSerializer, TransactionUpdateSerializer
from .services import TransactionService
from .models import Transaction


class TransactionListCreateView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        filters = {
            'category': request.query_params.get('category'),
            'date_from': request.query_params.get('date_from'),
            'date_to': request.query_params.get('date_to'),
            'search': request.query_params.get('search'),
        }
        transactions = TransactionService.list_transactions(cycle, filters)
        serializer = TransactionSerializer(transactions, many=True)
        return standard_response(data=serializer.data)

    def post(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            transaction = TransactionService.create_transaction(cycle, serializer.validated_data)
            return standard_response(
                message="Transaction logged successfully.",
                data=TransactionSerializer(transaction).data,
                status=201
            )
        return standard_response(success=False, message="Validation failed.", errors=serializer.errors, status=400)


class TransactionDetailView(APIView):
    def _get_transaction(self, pk, user):
        try:
            return Transaction.objects.get(pk=pk, cycle__user=user)
        except Transaction.DoesNotExist:
            raise ResourceNotFoundException("Transaction not found.")

    def get(self, request, pk):
        transaction = self._get_transaction(pk, request.user)
        return standard_response(data=TransactionSerializer(transaction).data)

    def patch(self, request, pk):
        transaction = self._get_transaction(pk, request.user)
        serializer = TransactionUpdateSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            updated = TransactionService.update_transaction(transaction, serializer.validated_data)
            return standard_response(message="Transaction updated.", data=TransactionSerializer(updated).data)
        return standard_response(success=False, message="Validation failed.", errors=serializer.errors, status=400)

    def delete(self, request, pk):
        transaction = self._get_transaction(pk, request.user)
        TransactionService.delete_transaction(transaction)
        return standard_response(message="Transaction deleted successfully.")
