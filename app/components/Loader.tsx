import { Loader2 } from 'lucide-react'

interface LoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Loader({ 
  message = 'Loading...', 
  size = 'md',
  className = ''
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin mb-4`} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </div>
  )
}

// Alternative inline loader for smaller spaces
export function InlineLoader({ 
  message = 'Loading...', 
  size = 'sm',
  className = ''
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
      <span className="text-gray-600 dark:text-gray-400 text-sm">{message}</span>
    </div>
  )
}

// Skeleton loader for content placeholders
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
}