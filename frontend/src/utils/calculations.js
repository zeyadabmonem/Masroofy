/**
 * Masroofy Daily Limit Calculation Engine
 * Single source of truth for all financial computations on the frontend.
 *
 * Edge cases handled:
 * - Cycle not started yet
 * - Cycle already expired
 * - Negative balance (overspending)
 * - Zero-allowance cycles
 * - Last day of cycle
 * - Spending exactly at 100%
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24

/** Strips time from a Date, returning midnight local time */
const midnight = (d) => {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Calculates the number of days between two dates, inclusive of both ends.
 * Returns 0 if end < start.
 */
export const daysBetweenInclusive = (start, end) => {
  const s = midnight(start)
  const e = midnight(end)
  const diff = Math.round((e - s) / MS_PER_DAY)
  return Math.max(diff + 1, 0)
}

/**
 * Calculates days from today to end_date, inclusive of today.
 * Returns 0 if end_date is in the past.
 */
export const remainingDaysInclusive = (endDate) => {
  const today = midnight(new Date())
  const end = midnight(endDate)
  const diff = Math.round((end - today) / MS_PER_DAY)
  return Math.max(diff + 1, 0)
}

/**
 * Determines the status of a budget cycle based on dates.
 * @returns 'PENDING' | 'ACTIVE' | 'EXPIRED'
 */
export const getCycleStatus = (startDate, endDate) => {
  const today = midnight(new Date())
  const start = midnight(startDate)
  const end = midnight(endDate)

  if (today < start) return 'PENDING'
  if (today > end) return 'EXPIRED'
  return 'ACTIVE'
}

/**
 * Computes the safe daily limit.
 * If remaining balance is negative (overspent), returns 0 — you cannot "earn back" days.
 * If remaining days = 0 (last day), returns the remaining balance directly.
 */
export const computeDailyLimit = (remainingBalance, remainingDays) => {
  if (remainingDays <= 0) return 0
  if (remainingBalance <= 0) return 0
  return remainingBalance / remainingDays
}

/**
 * Core calculation function — computes the full budget summary.
 * @param {Object} cycle - { total_allowance, start_date, end_date }
 * @param {Array}  transactions - list of { amount } objects
 * @returns {Object} full summary
 */
export const computeBudgetSummary = (cycle, transactions = []) => {
  const totalAllowance = parseFloat(cycle.total_allowance) || 0
  const totalSpent = transactions.reduce((acc, tx) => acc + parseFloat(tx.amount || 0), 0)
  const remainingBalance = totalAllowance - totalSpent

  const status = getCycleStatus(cycle.start_date, cycle.end_date)
  const totalDays = daysBetweenInclusive(cycle.start_date, cycle.end_date)
  const remainingDays = status === 'ACTIVE' ? remainingDaysInclusive(cycle.end_date) : 0
  const daysElapsed = totalDays - remainingDays
  const safeDailyLimit = computeDailyLimit(remainingBalance, remainingDays)

  const spendingPercentage =
    totalAllowance > 0
      ? Math.min((totalSpent / totalAllowance) * 100, 100)
      : 0

  // Determine alert level
  let alertLevel = 'NONE' // 'NONE' | 'WARNING' | 'EXHAUSTED'
  if (totalSpent >= totalAllowance) alertLevel = 'EXHAUSTED'
  else if (spendingPercentage >= 80) alertLevel = 'WARNING'

  return {
    total_allowance: totalAllowance,
    total_spent: totalSpent,
    remaining_balance: remainingBalance,
    remaining_days: remainingDays,
    total_days: totalDays,
    days_elapsed: daysElapsed,
    safe_daily_limit: safeDailyLimit,
    spending_percentage: spendingPercentage,
    alert_level: alertLevel,
    cycle_status: status,
  }
}
