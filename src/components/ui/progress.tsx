import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  max?: number
}

export const Progress: React.FC<ProgressProps> = ({ value, className, max = 100 }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700', className)}>
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
} 