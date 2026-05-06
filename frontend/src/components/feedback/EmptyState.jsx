import { clsx } from 'clsx'

const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
  className = '',
}) => {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl animate-fade-in',
      className
    )}>
      {Icon && (
        <div className="p-4 bg-bg-elevated text-text-muted rounded-full mb-4">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-xs mb-8">{description}</p>
      {action && (
        <div className="animate-scale-in">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
