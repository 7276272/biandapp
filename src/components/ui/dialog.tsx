'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

interface DialogHeaderProps {
  className?: string
  children: React.ReactNode
}

interface DialogTitleProps {
  className?: string
  children: React.ReactNode
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogTrigger) {
          return React.cloneElement(child as React.ReactElement, {
            onClick: () => handleOpenChange(true),
          })
        }
        if (React.isValidElement(child) && child.type === DialogContent) {
          return isOpen ? (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="relative">
                {React.cloneElement(child as React.ReactElement, {
                  onClose: () => handleOpenChange(false),
                })}
              </div>
            </div>
          ) : null
        }
        return child
      })}
    </div>
  )
}

export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {})
  }
  return <div>{children}</div>
}

export function DialogContent({ className, children, ...props }: DialogContentProps & { onClose?: () => void }) {
  return (
    <div className={cn('bg-background rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto', className)}>
      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={props.onClose}
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
} 