from rest_framework import serializers
from .models import BudgetCycle
from datetime import date


class BudgetCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCycle
        fields = ['id', 'total_allowance', 'start_date', 'end_date', 'is_active', 'created_at']
        read_only_fields = ['id', 'is_active', 'created_at']

    def validate(self, data):
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError("End date must be after start date.")
        return data

    def validate_total_allowance(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total allowance must be greater than zero.")
        return value


class BudgetSummarySerializer(serializers.Serializer):
    total_allowance = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    remaining_days = serializers.IntegerField()
    total_days = serializers.IntegerField()
    days_elapsed = serializers.IntegerField()
    safe_daily_limit = serializers.DecimalField(max_digits=12, decimal_places=2)
    spending_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
