import { useState, useCallback } from 'react'
import { userService } from '../services/userService'
import { securityService } from '../services/securityService'
import { useUIStore } from '../store/useUIStore'

export const useAuth = () => {
  const [profile, setProfile] = useState(null)
  const { setLoading, addToast } = useUIStore()

  const fetchProfile = useCallback(async () => {
    try {
      const res = await userService.getProfile()
      if (res?.data) {
        setProfile(res.data)
      }
    } catch (err) {
      if (err.status !== 404) addToast('Failed to load profile.', 'error')
    }
  }, [addToast])

  const updateProfile = useCallback(async (data) => {
    setLoading(true)
    try {
      const res = await userService.updateProfile(data)
      if (res?.data) {
        setProfile(res.data)
        addToast('Profile updated successfully.', 'success')
        return true
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [setLoading, addToast])

  const changePIN = useCallback(async (old_pin, new_pin) => {
    setLoading(true)
    try {
      const res = await securityService.changePIN(old_pin, new_pin)
      addToast(res.message || 'PIN changed successfully.', 'success')
      return true
    } catch (err) {
      addToast(err.message || 'Failed to change PIN.', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [setLoading, addToast])

  return { profile, fetchProfile, updateProfile, changePIN }
}
