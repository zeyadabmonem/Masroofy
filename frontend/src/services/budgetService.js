import apiClient from './apiClient'

export const budgetService = {
  listCycles: () => apiClient.get('/budgets/'),

  createCycle: (data) => apiClient.post('/budgets/', data),

  getActiveCycle: () => apiClient.get('/budgets/active/'),

  resetCycle: (id) => apiClient.delete(`/budgets/${id}/reset/`),
}
