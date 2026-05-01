import { useEffect, useState } from 'react'
import { ShieldCheck, Calendar, Wallet, RefreshCcw, User, Lock, LogOut } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useBudget } from '../hooks/useBudget'
import { useAuth } from '../hooks/useAuth'
import { useUIStore } from '../store/useUIStore'
import { securityService } from '../services/securityService'
import { formatCurrency } from '../utils/currency'

const SettingsPage = () => {
  const { activeCycle, resetCycle } = useBudget()
  const { profile, fetchProfile, updateProfile, changePIN } = useAuth()
  const { addToast } = useUIStore()

  const [profileForm, setProfileForm] = useState({ display_name: '', email: '' })
  const [pinForm, setPinForm] = useState({ old_pin: '', new_pin: '' })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPin, setLoadingPin] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        display_name: profile.display_name || '',
        email: profile.email || ''
      })
    }
  }, [profile])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    await updateProfile(profileForm)
    setLoadingProfile(false)
  }

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    if (pinForm.new_pin.length < 4 || pinForm.old_pin.length < 4) {
      addToast('PIN must be at least 4 digits.', 'error')
      return
    }
    setLoadingPin(true)
    const success = await changePIN(pinForm.old_pin, pinForm.new_pin)
    if (success) setPinForm({ old_pin: '', new_pin: '' })
    setLoadingPin(false)
  }

  const handleLogout = () => {
    securityService.logout()
    window.location.href = '/' // Simple redirect to reload app state
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-text-secondary">Manage your profile, security, and budget cycle.</p>
      </header>

      {/* Profile Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <User size={20} className="text-accent" />
          Profile
        </h3>
        <Card>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Display Name"
              value={profileForm.display_name}
              onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={loadingProfile}>Save Profile</Button>
            </div>
          </form>
        </Card>
      </section>

      {/* Security Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Lock size={20} className="text-accent" />
          Security
        </h3>
        <Card>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current PIN"
                type="password"
                maxLength={6}
                value={pinForm.old_pin}
                onChange={(e) => setPinForm({ ...pinForm, old_pin: e.target.value.replace(/[^0-9]/g, '') })}
              />
              <Input
                label="New PIN"
                type="password"
                maxLength={6}
                value={pinForm.new_pin}
                onChange={(e) => setPinForm({ ...pinForm, new_pin: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="danger" className="bg-danger/10 text-danger hover:bg-danger/20 border-0" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Lock App
              </Button>
              <Button type="submit" loading={loadingPin}>Change PIN</Button>
            </div>
          </form>
        </Card>
      </section>

      {/* Budget Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Wallet size={20} className="text-accent" />
          Budget Cycle
        </h3>
        {activeCycle ? (
          <>
            <Card className="bg-accent/5 border-accent/20 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-xl text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-bold">Active Cycle</p>
                  <p className="text-xs text-text-secondary">{activeCycle.start_date} to {activeCycle.end_date}</p>
                </div>
              </div>
              <Badge variant="primary">Active</Badge>
            </Card>

            <Card className="border-danger/20 bg-danger/5 space-y-4">
              <h3 className="text-lg font-bold text-danger flex items-center gap-2">
                <RefreshCcw size={20} />
                Danger Zone
              </h3>
              <p className="text-sm text-text-secondary">
                Resetting your cycle will archive current data and stop the active budget.
              </p>
              <Button variant="danger" className="w-full sm:w-auto" onClick={() => resetCycle()}>
                Reset Budget Cycle
              </Button>
            </Card>
          </>
        ) : (
          <Card className="text-center p-8 space-y-4">
            <p className="text-text-secondary">No active budget cycle.</p>
            {/* Create Budget Cycle form will be handled by a global modal or a simple form here. 
                For now, the global modal 'CREATE_CYCLE' from Dashboard works well. */}
          </Card>
        )}
      </section>
    </div>
  )
}

export default SettingsPage
