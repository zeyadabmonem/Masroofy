import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach JWT token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('masroofy_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────────────────────────
// Unwrap the standard envelope; surface errors cleanly
apiClient.interceptors.response.use(
  (response) => response.data, // Return only the payload, not the full Axios response
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // 401 → clear token and reload to trigger PIN lock screen
      if (status === 401) {
        sessionStorage.removeItem('masroofy_access_token')
        window.location.reload()
      }

      // Surface the standardized backend error message
      return Promise.reject({
        message: data?.message || 'An error occurred.',
        errors: data?.errors || {},
        status,
      })
    }

    // Network error (offline)
    return Promise.reject({
      message: 'You are offline. Data will sync when you reconnect.',
      errors: {},
      status: 0,
    })
  }
)

export default apiClient
