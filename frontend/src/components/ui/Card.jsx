import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={twMerge(clsx(
        'bg-bg-secondary border border-border rounded-2xl p-6 transition-all duration-200',
        hover && 'hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 cursor-pointer',
        onClick && 'active:scale-[0.98]',
        className
      ))}
    >
      {children}
    </div>
  )
}

export default Card
