import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      
      setTransactions: (transactions) => set({ transactions }),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      updateTransaction: (id, updatedTx) => set((state) => ({
        transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx)
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(tx => tx.id !== id)
      })),

      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'masroofy-transactions-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
