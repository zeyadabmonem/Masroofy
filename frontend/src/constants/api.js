const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export const API_ENDPOINTS = {
  // Auth
  PIN_SETUP: `${API_BASE_URL}/auth/pin/setup/`,
  PIN_VERIFY: `${API_BASE_URL}/auth/pin/verify/`,
  
  // User
  USER_ME: `${API_BASE_URL}/users/me/`,
  
  // Budgets
  BUDGETS: `${API_BASE_URL}/budgets/`,
  BUDGET_ACTIVE: `${API_BASE_URL}/budgets/active/`,
  BUDGET_RESET: (id) => `${API_BASE_URL}/budgets/${id}/reset/`,
  
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions/`,
  TRANSACTION_DETAIL: (id) => `${API_BASE_URL}/transactions/${id}/`,
  
  // Analytics
  ANALYTICS_SUMMARY: `${API_BASE_URL}/analytics/summary/`,
  ANALYTICS_CATEGORIES: `${API_BASE_URL}/analytics/category-breakdown/`,
  ANALYTICS_DAILY: `${API_BASE_URL}/analytics/daily-spending/`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  NOTIFICATION_DISMISS: (id) => `${API_BASE_URL}/notifications/${id}/dismiss/`,
}
