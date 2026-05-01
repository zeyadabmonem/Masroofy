import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { API_ENDPOINTS } from '@/constants/api'

const PINSetupPage = () => {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4 || pin.length > 6) {
      setError('PIN must be 4-6 digits')
      return
    }

    if (pin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.PIN_SETUP, {
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
        setError(data.message || 'Failed to set up PIN')
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
        Set Up Your PIN
      </h1>
      <p className="text-text-muted mb-8">
        Create a 4-6 digit PIN to secure your wallet
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Enter PIN"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            error={error}
          />

          <Input
            type="password"
            label="Confirm PIN"
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!pin || !confirmPin}
          >
            {loading ? 'Setting up...' : 'Continue'}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </Card>

      <p className="text-xs text-text-muted mt-6">
        Your PIN is encrypted and stored locally. Never share it with anyone.
      </p>
    </div>
  )
}

export default PINSetupPage
