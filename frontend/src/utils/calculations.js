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

/**
 * Strips time from a Date object, returning a new Date at midnight local time.
 * 
 * @param {Date|string} d - The date to process.
 * @returns {Date} Date object set to 00:00:00:000.
 */
const midnight = (d) => {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Calculates the number of days between two dates, inclusive of both ends.
 * 
 * @param {Date|string} start - The start date.
 * @param {Date|string} end - The end date.
 * @returns {number} The count of days (e.g., May 1 to May 2 is 2 days). Returns 0 if end < start.
 */
export const daysBetweenInclusive = (start, end) => {
  const s = midnight(start)
  const e = midnight(end)
  const diff = Math.round((e - s) / MS_PER_DAY)
  return Math.max(diff + 1, 0)
}

/**
 * Calculates days from today to the given end_date, inclusive of today.
 * 
 * @param {Date|string} endDate - The target end date.
 * @returns {number} Remaining days including today. Returns 0 if end_date is in the past.
 */
export const remainingDaysInclusive = (endDate) => {
  const today = midnight(new Date())
  const end = midnight(endDate)
  const diff = Math.round((end - today) / MS_PER_DAY)
  return Math.max(diff + 1, 0)
}

/**
 * Determines the status of a budget cycle based on dates relative to today.
 * 
 * @param {Date|string} startDate - Cycle start date.
 * @param {Date|string} endDate - Cycle end date.
 * @returns {'PENDING' | 'ACTIVE' | 'EXPIRED'} The calculated status.
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
 * Computes the safe daily limit (remaining balance divided by remaining days).
 * 
 * @param {number} remainingBalance - The amount of money left to spend.
 * @param {number} remainingDays - The number of days remaining in the cycle.
 * @returns {number} The daily budget limit. Returns 0 if overspent or if no days remain.
 */
export const computeDailyLimit = (remainingBalance, remainingDays) => {
  if (remainingDays <= 0) return 0
  if (remainingBalance <= 0) return 0
  return remainingBalance / remainingDays
}

/**
 * Core calculation function that computes the full budget summary.
 * 
 * @param {Object} cycle - Budget cycle details.
 * @param {number|string} cycle.total_allowance - Total budget for the cycle.
 * @param {Date|string} cycle.start_date - Cycle start date.
 * @param {Date|string} cycle.end_date - Cycle end date.
 * @param {Array<Object>} transactions - List of transaction objects.
 * @param {number|string} transactions[].amount - Amount of the transaction.
 * @returns {Object} A summary object containing processed metrics:
 *   - total_allowance (number)
 *   - total_spent (number)
 *   - remaining_balance (number)
 *   - remaining_days (number)
 *   - total_days (number)
 *   - days_elapsed (number)
 *   - safe_daily_limit (number)
 *   - spending_percentage (number)
 *   - alert_level ('NONE'|'WARNING'|'EXHAUSTED')
 *   - cycle_status ('PENDING'|'ACTIVE'|'EXPIRED')
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

