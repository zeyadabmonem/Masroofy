import { clsx } from 'clsx'

const ProgressBar = ({
  value, // 0 to 100
  max = 100,
  label,
  showValue = true,
  className = '',
  variant = 'primary' // 'primary', 'success', 'warning', 'danger'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
          {showValue && <span className="text-sm font-mono font-medium text-text-primary">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-bg-elevated rounded-full overflow-hidden">
        <div 
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
