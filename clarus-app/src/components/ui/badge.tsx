import { type ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/lib/utils/cn'

type BadgeTone = 'neutral' | 'primary' | 'warning' | 'success' | 'danger' | 'info'

type BadgeProps = ComponentPropsWithoutRef<'span'> &
  Readonly<{
    tone?: BadgeTone
  }>

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'border-border bg-surface-elevated text-muted-foreground',
  primary: 'border-primary/30 bg-primary/15 text-primary',
  warning: 'border-warning/30 bg-warning/15 text-warning',
  success: 'border-success/30 bg-success/15 text-success',
  danger: 'border-danger/30 bg-danger/15 text-danger',
  info: 'border-info/30 bg-info/15 text-info',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, tone = 'neutral', ...props },
  ref,
) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold',
        badgeTones[tone],
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})
