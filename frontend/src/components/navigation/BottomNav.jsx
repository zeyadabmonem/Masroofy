import { useEffect, useState } from 'react'
import { Home, History, PieChart, Plus, Settings, Bell } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { useNotifications } from '../../hooks/useNotifications'
import { useUIStore } from '../../store/useUIStore'

const BottomNav = () => {
  const { unreadCount, fetchNotifications } = useNotifications()
  const { openModal } = useUIStore()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const navItems = [
    { name: 'Home',    icon: Home,    path: '/' },
    { name: 'History', icon: History, path: '/transactions' },
    { name: 'Add',     icon: Plus,    special: true },
    { name: 'Stats',   icon: PieChart, path: '/analytics' },
    { name: 'Settings',icon: Settings, path: '/settings' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary/90 backdrop-blur-lg border-t border-border px-4 py-3 z-40">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => (
          item.special ? (
            <button
              key="add"
              onClick={() => openModal('ADD_TRANSACTION')}
              className="relative -top-7 w-14 h-14 bg-accent rounded-2xl shadow-xl shadow-accent/40 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <item.icon size={28} strokeWidth={3} />
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex flex-col items-center gap-1 transition-all duration-200 relative',
                isActive ? 'text-accent' : 'text-text-secondary'
              )}
            >
              <div className="relative">
                <item.icon size={22} />
                {item.name === 'Alerts' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.name}</span>
            </NavLink>
          )
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
