import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type InfoRowProps = Readonly<{
  action?: ReactNode
  className?: string
  icon?: LucideIcon
  label: ReactNode
  value: ReactNode
}>

export function InfoRow({ action, className, icon: Icon, label, value }: InfoRowProps) {
  return (
    <div
      className={cn(
        'flex min-h-[var(--size-secondary-button)] items-center gap-3 border-b border-border py-3 last:border-b-0',
        className,
      )}
    >
      {Icon ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-surface-elevated text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-base font-semibold text-foreground">{value}</p>
      </div>
      {action ?? (
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  )
}
