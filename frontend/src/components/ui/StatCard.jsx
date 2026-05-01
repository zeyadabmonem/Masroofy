import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'up', 'down', 'neutral'
  className = '',
  loading = false,
}) => {
  return (
    <div className={twMerge(clsx(
      'bg-bg-secondary border border-border p-5 rounded-2xl animate-fade-in transition-all hover:border-accent/50 group',
      className
    ))}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-text-secondary text-sm font-medium">{label}</span>
        {Icon && (
          <div className="p-2 bg-bg-elevated rounded-xl group-hover:bg-accent/10 group-hover:text-accent transition-colors">
            <Icon size={20} />
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="h-8 w-24 bg-bg-elevated animate-pulse rounded-lg"></div>
      ) : (
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-text-primary font-mono">{value}</h3>
          {trend && (
            <span className={clsx(
              'text-xs font-medium px-1.5 py-0.5 rounded-md',
              trendType === 'up' && 'bg-success/10 text-success',
              trendType === 'down' && 'bg-danger/10 text-danger',
              trendType === 'neutral' && 'bg-bg-elevated text-text-muted'
            )}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default StatCard
