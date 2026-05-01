import { useState, useEffect } from 'react'
import { Lock, Fingerprint, KeyRound } from 'lucide-react'
import { securityService } from '../services/securityService'
import Button from './ui/Button'
import { clsx } from 'clsx'

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasPinSetup, setHasPinSetup] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user already has a valid token
    const token = localStorage.getItem('masroofy_access_token')
    if (token) {
      setIsAuthenticated(true)
      return
    }

    // Otherwise, check if PIN is set up
    const checkStatus = async () => {
      try {
        const res = await securityService.checkStatus()
        setHasPinSetup(res?.data?.has_pin)
      } catch (err) {
        setHasPinSetup(false)
      }
    }
    checkStatus()
  }, [])

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      if (hasPinSetup) {
        await securityService.verifyPIN(pin)
        setIsAuthenticated(true)
      } else {
        const res = await securityService.setupPIN(pin)
        if (res?.data?.access) {
          localStorage.setItem('masroofy_access_token', res.data.access)
          setIsAuthenticated(true)
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid PIN')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  // Pass-through if authenticated
  if (isAuthenticated) return children

  // Loading state while checking PIN status
  if (hasPinSetup === null) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-xs w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            {hasPinSetup ? 'Welcome Back' : 'Setup Vault PIN'}
          </h1>
          <p className="text-text-secondary text-sm">
            {hasPinSetup 
              ? 'Enter your PIN to unlock Masroofy.' 
              : 'Create a secure PIN to protect your financial data.'}
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={clsx(
                    "w-4 h-4 rounded-full transition-colors",
                    i < pin.length ? "bg-accent" : "bg-bg-elevated border border-border"
                  )}
                />
              ))}
            </div>
            
            {/* Hidden Input for Mobile Keyboard */}
            <input 
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="opacity-0 absolute inset-0 -z-10"
            />
          </div>

          {error && <p className="text-danger text-sm text-center font-medium animate-shake">{error}</p>}

          <Button type="submit" className="w-full" loading={loading} disabled={pin.length < 4}>
            {hasPinSetup ? 'Unlock Vault' : 'Set PIN'}
          </Button>
          
          {hasPinSetup && (
            <button type="button" className="w-full flex items-center justify-center gap-2 text-text-muted hover:text-accent transition-colors py-2 text-sm">
              <Fingerprint size={16} />
              Use Biometrics
            </button>
          )}
        </form>
        
        {/* Visual Numpad for Desktop/Web testing */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'del'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                if (num === 'C') setPin('')
                else if (num === 'del') setPin(pin.slice(0, -1))
                else if (pin.length < 6) setPin(pin + num)
              }}
              className="h-14 bg-bg-elevated hover:bg-border rounded-2xl flex items-center justify-center text-xl font-bold transition-colors"
            >
              {num === 'del' ? '⌫' : num}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AuthGuard
