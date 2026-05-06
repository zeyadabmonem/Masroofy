import { AlertCircle } from 'lucide-react'
import Button from '../ui/Button'

const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading the data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-muted max-w-sm mb-6">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export default ErrorState
