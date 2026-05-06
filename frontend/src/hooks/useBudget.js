import { useCallback } from 'react'
import { budgetService } from '../services/budgetService'
import { useBudgetStore } from '../store/useBudgetStore'
import { useTransactionStore } from '../store/useTransactionStore'
import { useUIStore } from '../store/useUIStore'

export const useBudget = () => {
  const { activeCycle, summary, setActiveCycle, updateSummary, resetBudget } = useBudgetStore()
  const { transactions, clearTransactions } = useTransactionStore()
  const { setLoading, addToast } = useUIStore()

  const fetchActiveCycle = useCallback(async () => {
    setLoading(true)
    try {
      const res = await budgetService.getActiveCycle()
      if (res?.data) {
        setActiveCycle(res.data)
      }
    } catch (err) {
      // If 404, no active cycle — not a critical error
      if (err.status !== 404) {
        addToast(err.message || 'Failed to load budget.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [setActiveCycle, setLoading, addToast])

  const createCycle = useCallback(async (data) => {
    setLoading(true)
    try {
      const res = await budgetService.createCycle(data)
      if (res?.data) {
        setActiveCycle(res.data)
        clearTransactions() // Clear old transactions from local store
        addToast('Budget cycle created!', 'success')
        return true
      }
    } catch (err) {
      addToast(err.message || 'Failed to create budget cycle.', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [setActiveCycle, setLoading, addToast])

  const resetCycle = useCallback(async () => {
    if (!activeCycle) return
    setLoading(true)
    try {
      await budgetService.resetCycle(activeCycle.id)
      resetBudget()
      clearTransactions()
      addToast('Budget cycle has been reset.', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to reset cycle.', 'error')
    } finally {
      setLoading(false)
    }
  }, [activeCycle, resetBudget, clearTransactions, setLoading, addToast])

  // Recompute summary whenever transactions change
  const recomputeSummary = useCallback(() => {
    updateSummary(transactions)
  }, [transactions, updateSummary])

  return { activeCycle, summary, fetchActiveCycle, createCycle, resetCycle, recomputeSummary }
}
