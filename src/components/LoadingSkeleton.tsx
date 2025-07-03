import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'card'
  animation?: 'pulse' | 'shimmer' | 'wave'
  lines?: number
  style?: React.CSSProperties
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  animation = 'shimmer',
  lines = 1,
  style
}: LoadingSkeletonProps) {
  const baseClasses = cn(
    'bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20',
    {
      'animate-pulse': animation === 'pulse',
      'shimmer': animation === 'shimmer',
      'animate-pulse bg-gradient-to-r from-muted/20 via-muted/50 to-muted/20': animation === 'wave',
    }
  )

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    card: 'h-32 rounded-lg'
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, index) => ({
          id: `skeleton-${Math.random().toString(36).substr(2, 9)}-${index}`,
          index
        })).map(({ id, index }) => (
          <div
            key={id}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}
