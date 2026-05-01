from transactions.models import Transaction
from budgets.models import BudgetCycle
from core.exceptions import ResourceNotFoundException, BusinessLogicException
from decimal import Decimal


class TransactionService:
    @staticmethod
    def list_transactions(cycle: BudgetCycle, filters: dict = None):
        qs = Transaction.objects.filter(cycle=cycle)
        if filters:
            if filters.get('category'):
                qs = qs.filter(category=filters['category'])
            if filters.get('date_from'):
                qs = qs.filter(created_at__date__gte=filters['date_from'])
            if filters.get('date_to'):
                qs = qs.filter(created_at__date__lte=filters['date_to'])
            if filters.get('search'):
                qs = qs.filter(note__icontains=filters['search'])
        return qs.order_by('-created_at')

    @staticmethod
    def create_transaction(cycle: BudgetCycle, data: dict) -> Transaction:
        if data['amount'] <= 0:
            raise BusinessLogicException("Transaction amount must be greater than zero.")
        return Transaction.objects.create(
            cycle=cycle,
            amount=data['amount'],
            category=data.get('category', 'OTHER'),
            note=data.get('note', ''),
        )

    @staticmethod
    def update_transaction(transaction: Transaction, data: dict) -> Transaction:
        if 'amount' in data and data['amount'] <= 0:
            raise BusinessLogicException("Transaction amount must be greater than zero.")
        for field, value in data.items():
            setattr(transaction, field, value)
        transaction.save()
        return transaction

    @staticmethod
    def delete_transaction(transaction: Transaction) -> None:
        transaction.delete()
