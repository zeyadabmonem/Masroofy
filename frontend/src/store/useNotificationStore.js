import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter((n) => !n.is_dismissed).length,
      }),

      markDismissed: (id) => set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, is_dismissed: true } : n
        )
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.is_dismissed).length,
        }
      }),

      markAllDismissed: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_dismissed: true })),
        unreadCount: 0,
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.is_dismissed ? 0 : 1),
      })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'masroofy-notifications-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
