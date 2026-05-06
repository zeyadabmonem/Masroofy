import { clsx } from 'clsx'

const ProgressRing = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true,
  color = 'accent',
  className = '',
}) => {
  const normalizedRadius = (size - strokeWidth) / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / max) * circumference
  
  const colors = {
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  }
  
  const strokeColor = colors[color] || colors.accent

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="#1F2937"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-text-primary font-mono">
            {Math.round((value / max) * 100)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-text-secondary mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}

export default ProgressRing
