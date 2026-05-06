import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { computeBudgetSummary } from '../utils/calculations'

const DEFAULT_SUMMARY = {
  total_allowance: 0,
  total_spent: 0,
  remaining_balance: 0,
  safe_daily_limit: 0,
  remaining_days: 0,
  total_days: 0,
  days_elapsed: 0,
  spending_percentage: 0,
  alert_level: 'NONE',
  cycle_status: 'NONE',
}

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      activeCycle: null,
      summary: DEFAULT_SUMMARY,

      setActiveCycle: (cycle) => set({ activeCycle: cycle }),

      /**
       * Recomputes the full summary using the hardened calculation engine.
       * Called every time transactions change.
       */
      updateSummary: (transactions) => {
        const { activeCycle } = get()
        if (!activeCycle) return
        const summary = computeBudgetSummary(activeCycle, transactions)
        set({ summary })
      },

      resetBudget: () => set({
        activeCycle: null,
        summary: DEFAULT_SUMMARY,
      }),
    }),
    {
      name: 'masroofy-budget-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
