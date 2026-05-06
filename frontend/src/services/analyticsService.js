import apiClient from './apiClient'

export const analyticsService = {
  getSummary: () => apiClient.get('/analytics/summary/'),
  getCategoryBreakdown: () => apiClient.get('/analytics/category-breakdown/'),
  getDailySpending: () => apiClient.get('/analytics/daily-spending/'),
}
