import { FileQuestion, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type EmptyStateProps = Readonly<{
  action?: ReactNode
  className?: string
  description?: string
  icon?: LucideIcon
  title: string
}>

export function EmptyState({
  action,
  className,
  description,
  icon: Icon = FileQuestion,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border p-8 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground mb-4">
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground max-w-[250px]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
