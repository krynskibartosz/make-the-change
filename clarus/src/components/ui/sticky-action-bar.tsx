import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type StickyActionBarProps = Readonly<{
  className?: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
}>

export function StickyActionBar({
  className,
  primaryAction,
  secondaryAction,
}: StickyActionBarProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/94 px-5 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        {secondaryAction ? <div className="shrink-0">{secondaryAction}</div> : null}
        {primaryAction ? <div className="min-w-0 flex-1">{primaryAction}</div> : null}
      </div>
    </div>
  )
}
