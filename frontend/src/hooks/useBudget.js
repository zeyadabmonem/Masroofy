import { useCallback } from 'react'
import { budgetService } from '../services/budgetService'
import { useBudgetStore } from '../store/useBudgetStore'
import { useTransactionStore } from '../store/useTransactionStore'
import { useUIStore } from '../store/useUIStore'

/**
 * Custom hook for managing budget cycle operations and state.
 * 
 * Provides methods for fetching the active cycle, creating new cycles, 
 * resetting current cycles, and recomputing budget summaries.
 * 
 * @returns {Object} Budget operations and state:
 *   - activeCycle {Object|null}: The currently active budget cycle data.
 *   - summary {Object|null}: Calculated budget metrics.
 *   - fetchActiveCycle {Function}: Async function to load the active cycle from the server.
 *   - createCycle {Function}: Async function to initialize a new budget cycle.
 *   - resetCycle {Function}: Async function to archive the current cycle.
 *   - recomputeSummary {Function}: Synchronous function to refresh metrics based on local transactions.
 */
export const useBudget = () => {
  const { activeCycle, summary, setActiveCycle, updateSummary, resetBudget } = useBudgetStore()
  const { transactions, clearTransactions } = useTransactionStore()
  const { setLoading, addToast } = useUIStore()

  /**
   * Fetches the active budget cycle from the backend.
   * 
   * @async
   */
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

  /**
   * Creates a new budget cycle.
   * 
   * @async
   * @param {Object} data - New cycle configuration.
   * @param {number} data.total_allowance - Total budget amount.
   * @param {string} data.start_date - ISO date string for start.
   * @param {string} data.end_date - ISO date string for end.
   * @returns {Promise<boolean>} True if creation was successful.
   */
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

  /**
   * Resets (archives) the current active budget cycle.
   * 
   * @async
   */
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

  /**
   * Recomputes the local budget summary based on the current transaction list.
   */
  const recomputeSummary = useCallback(() => {
    updateSummary(transactions)
  }, [transactions, updateSummary])

  return { activeCycle, summary, fetchActiveCycle, createCycle, resetCycle, recomputeSummary }
}

