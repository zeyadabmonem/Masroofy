from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('cycle', 'amount', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('note',)
