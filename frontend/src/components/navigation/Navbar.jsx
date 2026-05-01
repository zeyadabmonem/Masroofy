import { Wallet, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const Navbar = ({ title, showMenu = true }) => {
  const navigate = useNavigate()

  return (
    <nav className="bg-bg-elevated border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-text-primary">{title || 'Masroofy'}</h1>
      </div>
      
      {showMenu && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              navigate('/pin/lock')
            }}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
