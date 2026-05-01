import { useState, useCallback } from 'react'
import { analyticsService } from '../services/analyticsService'
import { useUIStore } from '../store/useUIStore'

export const useAnalytics = () => {
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [dailySpending, setDailySpending] = useState([])
  const { addToast } = useUIStore()

  const fetchCategoryBreakdown = useCallback(async () => {
    try {
      const res = await analyticsService.getCategoryBreakdown()
      if (res?.data) setCategoryBreakdown(res.data)
    } catch (err) {
      if (err.status !== 404) addToast('Failed to load category data.', 'error')
    }
  }, [addToast])

  const fetchDailySpending = useCallback(async () => {
    try {
      const res = await analyticsService.getDailySpending()
      if (res?.data) setDailySpending(res.data)
    } catch (err) {
      if (err.status !== 404) addToast('Failed to load daily spending data.', 'error')
    }
  }, [addToast])

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchCategoryBreakdown(), fetchDailySpending()])
  }, [fetchCategoryBreakdown, fetchDailySpending])

  return { categoryBreakdown, dailySpending, fetchAll }
}
