import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Badge = ({
  children,
  variant = 'neutral', // 'primary', 'success', 'warning', 'danger', 'neutral'
  className = '',
  dot = false,
}) => {
  const variants = {
    primary: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    neutral: 'bg-bg-elevated text-text-secondary border-border',
  }

  return (
    <span className={twMerge(clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant],
      className
    ))}>
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          variant === 'primary' && 'bg-accent',
          variant === 'success' && 'bg-success',
          variant === 'warning' && 'bg-warning',
          variant === 'danger' && 'bg-danger',
          variant === 'neutral' && 'bg-text-muted'
        )} />
      )}
      {children}
    </span>
  )
}

export default Badge
