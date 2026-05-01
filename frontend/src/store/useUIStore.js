import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  modal: {
    isOpen: false,
    type: null, // 'ADD_TRANSACTION', 'EDIT_TRANSACTION', 'RESET_CYCLE'
    data: null,
  },
  
  openModal: (type, data = null) => set({ 
    modal: { isOpen: true, type, data } 
  }),
  
  closeModal: () => set({ 
    modal: { isOpen: false, type: null, data: null } 
  }),

  toasts: [],
  addToast: (message, type = 'info') => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), message, type }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))
