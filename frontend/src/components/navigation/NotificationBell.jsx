import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCheck, AlertTriangle, XCircle, Info } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { clsx } from 'clsx'

const TYPE_CONFIG = {
  WARNING_80: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  EXHAUSTED:  { icon: XCircle,       color: 'text-danger',  bg: 'bg-danger/10 border-danger/20'   },
  SYSTEM:     { icon: Info,          color: 'text-accent',  bg: 'bg-accent/10 border-accent/20'   },
}

const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, dismiss, dismissAll } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors"
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-96 bg-bg-secondary border border-border rounded-3xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={dismissAll}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted">
                <Bell size={32} strokeWidth={1.5} />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.SYSTEM
                const Icon = cfg.icon
                return (
                  <div
                    key={n.id}
                    className={clsx(
                      'flex gap-4 px-5 py-4 transition-colors',
                      n.is_dismissed ? 'opacity-50' : 'hover:bg-bg-elevated'
                    )}
                  >
                    <div className={clsx('p-2 rounded-xl border flex-shrink-0 h-fit mt-0.5', cfg.bg)}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{n.message}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!n.is_dismissed && (
                      <button
                        onClick={() => dismiss(n.id)}
                        className="text-text-muted hover:text-text-primary flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
