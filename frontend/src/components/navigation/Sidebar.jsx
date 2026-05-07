import { useState } from 'react'
import { Home, History, PieChart, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import NotificationBell from './NotificationBell'
import { securityService } from '../../services/securityService'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Transactions', icon: History, path: '/transactions' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ]

  const handleLogout = () => {
    securityService.logout()
    window.location.reload()
  }


  return (
    <aside 
      className={clsx(
        "hidden lg:flex flex-col bg-bg-secondary border-r border-border h-screen sticky top-0 z-50 transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-bg-secondary border border-border rounded-full flex items-center justify-center text-text-muted hover:text-accent z-50 transition-colors shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className={clsx("p-5 flex items-center transition-all", isCollapsed ? "flex-col justify-center gap-4" : "justify-between")}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">M</div>
          {!isCollapsed && <h1 className="text-2xl font-bold text-accent tracking-tight">Masroofy</h1>}
        </div>
        <NotificationBell />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.name}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 py-3 rounded-xl transition-all duration-200 font-medium group',
              isCollapsed ? 'justify-center px-0' : 'px-4',
              isActive 
                ? 'bg-accent/10 text-accent' 
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            )}
          >
            <item.icon size={20} className={clsx(
              'transition-colors flex-shrink-0',
              'group-hover:text-accent'
            )} />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button 
          title="Lock Vault"
          onClick={handleLogout}
          className={clsx(
            "flex items-center gap-3 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors font-medium",
            isCollapsed ? "justify-center px-0 w-full" : "px-4 w-full"
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Lock Vault</span>}
        </button>
      </div>
    </aside>
  )
}


export default Sidebar
