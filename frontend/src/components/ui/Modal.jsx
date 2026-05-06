import { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md' // 'sm', 'md', 'lg', 'xl', 'full'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[95vh]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={clsx(
        'relative w-full bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-bg-primary/30 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
