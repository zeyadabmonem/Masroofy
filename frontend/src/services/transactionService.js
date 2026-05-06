import apiClient from './apiClient'

export const transactionService = {
  list: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.search) params.append('search', filters.search)
    return apiClient.get(`/transactions/?${params.toString()}`)
  },

  create: (data) => apiClient.post('/transactions/', data),

  getById: (id) => apiClient.get(`/transactions/${id}/`),

  update: (id, data) => apiClient.patch(`/transactions/${id}/`, data),

  delete: (id) => apiClient.delete(`/transactions/${id}/`),
}
