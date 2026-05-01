import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { API_ENDPOINTS } from '@/constants/api'

const PINLockPage = () => {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!pin) {
      setError('Please enter your PIN')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.PIN_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('access_token', data.data.access)
        localStorage.setItem('refresh_token', data.data.refresh)
        navigate('/dashboard')
      } else {
        setAttempts(prev => prev + 1)
        setError(data.message || 'Invalid PIN')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
        <Lock className="h-8 w-8 text-accent" />
      </div>
      
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Welcome Back
      </h1>
      <p className="text-text-muted mb-8">
        Enter your PIN to unlock your wallet
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            error={error}
            autoFocus
          />

          {error && (
            <div className="flex items-center gap-2 text-danger text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!pin}
          >
            {loading ? 'Verifying...' : 'Unlock'}
          </Button>
        </form>
      </Card>

      {attempts >= 3 && (
        <p className="text-xs text-warning mt-4">
          {5 - attempts} attempts remaining before lockout
        </p>
      )}
    </div>
  )
}

export default PINLockPage
