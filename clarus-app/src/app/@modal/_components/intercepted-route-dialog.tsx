import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type InterceptedRouteDialogProps = Readonly<{
  ariaLabel?: string
  children: ReactNode
  className?: string
}>

export function InterceptedRouteDialog({
  ariaLabel = 'Route modale Clarus',
  children,
  className,
}: InterceptedRouteDialogProps) {
  return (
    <div
      aria-label={ariaLabel}
      aria-modal="true"
      className={cn('fixed inset-0 z-50 bg-background', className)}
      role="dialog"
    >
      {children}
    </div>
  )
}
