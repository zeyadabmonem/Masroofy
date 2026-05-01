import { Home, History, PieChart, Settings, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import NotificationBell from './NotificationBell'

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Transactions', icon: History, path: '/transactions' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-border h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">M</div>
          Masroofy
        </h1>
        <NotificationBell />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group',
              isActive 
                ? 'bg-accent/10 text-accent' 
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            )}
          >
            <item.icon size={20} className={clsx(
              'transition-colors',
              'group-hover:text-accent'
            )} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 w-full transition-colors font-medium">
          <LogOut size={20} />
          Lock Vault
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
