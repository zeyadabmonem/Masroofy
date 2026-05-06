import apiClient from './apiClient'

export const notificationService = {
  list: () => apiClient.get('/notifications/'),
  check: () => apiClient.post('/notifications/check/'),
  dismiss: (id) => apiClient.patch(`/notifications/${id}/dismiss/`),
  dismissAll: () => apiClient.patch('/notifications/dismiss-all/'),
}
