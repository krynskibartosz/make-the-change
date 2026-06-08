import { type ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/lib/utils/cn'

type CardProps = ComponentPropsWithoutRef<'div'> &
  Readonly<{
    elevated?: boolean
  }>

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, elevated = false, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-border bg-surface p-4',
        elevated && 'bg-surface-elevated shadow-[var(--shadow-elevated)]',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})
