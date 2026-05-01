import { useState, useCallback } from 'react'
import { transactionService } from '../services/transactionService'
import { useTransactionStore } from '../store/useTransactionStore'
import { useUIStore } from '../store/useUIStore'
import { useBudgetStore } from '../store/useBudgetStore'
import { useNotifications } from './useNotifications'

export const useTransactions = () => {
  const { transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore()
  const { updateSummary } = useBudgetStore()
  const { setLoading, addToast, closeModal } = useUIStore()
  const { checkAlerts } = useNotifications()
  const [filters, setFilters] = useState({})

  const fetchTransactions = useCallback(async (activeFilters = {}) => {
    setLoading(true)
    try {
      const res = await transactionService.list(activeFilters)
      if (res?.data) {
        setTransactions(res.data)
        updateSummary(res.data)
      }
    } catch (err) {
      addToast(err.message || 'Failed to load transactions.', 'error')
    } finally {
      setLoading(false)
    }
  }, [setTransactions, updateSummary, setLoading, addToast])

  const logExpense = useCallback(async (data) => {
    try {
      const res = await transactionService.create(data)
      if (res?.data) {
        const updated = [res.data, ...transactions]
        addTransaction(res.data)
        updateSummary(updated)
        addToast('Expense logged!', 'success')
        closeModal()
        // Trigger notification check AFTER summary is updated
        await checkAlerts()
        return true
      }
    } catch (err) {
      addToast(err.message || 'Failed to log expense.', 'error')
      return false
    }
  }, [transactions, addTransaction, updateSummary, addToast, closeModal, checkAlerts])

  const editTransaction = useCallback(async (id, data) => {
    try {
      const res = await transactionService.update(id, data)
      if (res?.data) {
        updateTransaction(id, res.data)
        const updated = transactions.map(tx => tx.id === id ? res.data : tx)
        updateSummary(updated)
        addToast('Transaction updated.', 'success')
        closeModal()
        // Re-check alerts after edit (spending may cross threshold)
        await checkAlerts()
        return true
      }
    } catch (err) {
      addToast(err.message || 'Failed to update transaction.', 'error')
      return false
    }
  }, [transactions, updateTransaction, updateSummary, addToast, closeModal, checkAlerts])

  const removeTransaction = useCallback(async (id) => {
    try {
      await transactionService.delete(id)
      deleteTransaction(id)
      const remaining = transactions.filter(tx => tx.id !== id)
      updateSummary(remaining)
      addToast('Transaction deleted.', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to delete transaction.', 'error')
    }
  }, [transactions, deleteTransaction, updateSummary, addToast])

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters)
    fetchTransactions(newFilters)
  }, [fetchTransactions])

  return {
    transactions,
    filters,
    fetchTransactions,
    logExpense,
    editTransaction,
    removeTransaction,
    applyFilters,
  }
}
