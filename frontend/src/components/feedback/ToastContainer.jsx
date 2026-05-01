// Global toast container — renders toasts from useUIStore
import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { clsx } from 'clsx'

const ICONS = {
  success: <CheckCircle2 size={20} className="text-success" />,
  error: <XCircle size={20} className="text-danger" />,
  info: <Info size={20} className="text-accent" />,
}

const ToastItem = ({ id, message, type }) => {
  const { removeToast } = useUIStore()

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl animate-scale-in',
      'bg-bg-secondary',
      type === 'success' && 'border-success/20',
      type === 'error' && 'border-danger/20',
      type === 'info' && 'border-accent/20',
    )}>
      {ICONS[type] || ICONS.info}
      <p className="text-sm font-medium text-text-primary">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="ml-2 text-text-muted hover:text-text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts } = useUIStore()

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default ToastContainer
