const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-text-secondary font-medium animate-pulse">{message}</p>
    </div>
  )
}

export default LoadingState
