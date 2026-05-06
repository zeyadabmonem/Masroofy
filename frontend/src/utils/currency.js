/**
 * Currency formatting utilities for Masroofy.
 * Centralizes all number display logic to avoid scattered .toFixed() calls.
 */

const DEFAULT_CURRENCY = 'EGP'

/**
 * Formats a number as a currency string.
 * @example formatCurrency(1234.5) → "1,234.50 EGP"
 */
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY) => {
  const num = parseFloat(amount) || 0
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

/**
 * Formats a number as a compact currency string (no decimals for large values).
 * @example formatCurrencyCompact(15000) → "15,000 EGP"
 */
export const formatCurrencyCompact = (amount, currency = DEFAULT_CURRENCY) => {
  const num = parseFloat(amount) || 0
  return `${num.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`
}

/**
 * Returns a raw formatted number string with 2 decimal places.
 * @example formatAmount(99.9) → "99.90"
 */
export const formatAmount = (amount) => {
  return (parseFloat(amount) || 0).toFixed(2)
}
