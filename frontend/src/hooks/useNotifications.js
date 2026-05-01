import { useCallback } from 'react'
import { notificationService } from '../services/notificationService'
import { useNotificationStore } from '../store/useNotificationStore'
import { useUIStore } from '../store/useUIStore'

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    setNotifications,
    markDismissed,
    markAllDismissed,
    addNotification,
  } = useNotificationStore()
  const { addToast } = useUIStore()

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.list()
      if (res?.data?.notifications) {
        setNotifications(res.data.notifications)
      }
    } catch (_) {
      // Non-critical — use persisted data from Zustand store if offline
    }
  }, [setNotifications])

  /**
   * Called automatically after every transaction.
   * Triggers backend threshold check; shows a toast for new alerts.
   */
  const checkAlerts = useCallback(async () => {
    try {
      const res = await notificationService.check()
      const triggered = res?.data?.triggered || []
      triggered.forEach((n) => {
        addNotification(n)
        const type = n.notification_type === 'EXHAUSTED' ? 'error' : 'info'
        addToast(n.message, type)
      })
    } catch (_) {
      // Silently fail — notification check is never blocking
    }
  }, [addNotification, addToast])

  const dismiss = useCallback(async (id) => {
    markDismissed(id) // Optimistic update
    try {
      await notificationService.dismiss(id)
    } catch (_) {
      // If offline, local state is already correct
    }
  }, [markDismissed])

  const dismissAll = useCallback(async () => {
    markAllDismissed() // Optimistic update
    try {
      await notificationService.dismissAll()
    } catch (_) {}
  }, [markAllDismissed])

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    checkAlerts,
    dismiss,
    dismissAll,
  }
}
