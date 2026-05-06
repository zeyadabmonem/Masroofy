import { clsx } from 'clsx'

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary px-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={clsx(
            'w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all',
            Icon && 'pl-11',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-danger px-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
