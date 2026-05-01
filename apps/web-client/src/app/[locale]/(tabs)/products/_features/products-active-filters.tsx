import { Button } from '@make-the-change/core/ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ActiveFilterChip = {
  key: string
  label: string
  onRemove: () => void
}

type ProductsActiveFiltersProps = {
  title: string
  chips: ActiveFilterChip[]
  clearAllLabel: string
  onClearAll: () => void
  className?: string
}

export function ProductsActiveFilters({
  title,
  chips,
  clearAllLabel,
  onClearAll,
  className,
}: ProductsActiveFiltersProps) {
  if (chips.length === 0) {
    return null
  }

  return (
    <section className={cn('space-y-2', className)} aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {clearAllLabel}
        </Button>
      </div>

      <div className="-mx-1 overflow-x-auto px-1">
        <ul className="flex min-w-max items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.onRemove}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <span>{chip.label}</span>
                <X className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-primary" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
