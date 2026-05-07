import apiClient from './apiClient'

const TOKEN_KEY = 'masroofy_access_token'

export const securityService = {
  checkStatus: () => apiClient.get('/auth/pin/status/'),

  setupPIN: (pin) => apiClient.post('/auth/pin/setup/', { pin }),

  verifyPIN: async (pin) => {
    const data = await apiClient.post('/auth/pin/verify/', { pin })
    if (data?.data?.access) {
      sessionStorage.setItem(TOKEN_KEY, data.data.access)
    }
    return data
  },

  changePIN: (old_pin, new_pin) => apiClient.post('/auth/pin/change/', { old_pin, new_pin }),

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated: () => !!sessionStorage.getItem(TOKEN_KEY),
}

