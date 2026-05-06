import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 focus:ring-accent',
    secondary: 'bg-bg-elevated hover:bg-bg-secondary text-text-primary border border-border hover:border-text-muted focus:ring-accent',
    ghost: 'bg-transparent hover:bg-bg-elevated text-text-primary focus:ring-accent',
    danger: 'bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 focus:ring-danger',
    success: 'bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 focus:ring-success',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }
  
  return (
    <button
      className={twMerge(clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      ))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  )
}

export default Button
