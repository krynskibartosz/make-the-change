import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type SelectableCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> &
  Readonly<{
    children: ReactNode
    description?: ReactNode
    disabled?: boolean
    selected?: boolean
  }>

/**
 * Carte interactive sélectionnable — utilisée dans les steps du wizard d'intervention.
 * Remplace le détournement de <Card> avec des props non supportées.
 */
export const SelectableCard = forwardRef<HTMLDivElement, SelectableCardProps>(
  function SelectableCard(
    { children, className, description, disabled = false, onClick, selected = false, ...props },
    ref,
  ) {
    return (
      <div
        aria-disabled={disabled}
        aria-selected={selected}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
          }
        }}
        className={cn(
          'rounded-[var(--radius-card)] border p-4 transition-all duration-150 cursor-pointer select-none',
          selected
            ? 'border-primary bg-primary/8 ring-1 ring-primary/40'
            : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-elevated',
          disabled && 'pointer-events-none opacity-40',
          className,
        )}
        ref={ref}
        {...props}
      >
        <p className="text-sm font-semibold text-foreground">{children}</p>
        {description != null && (
          <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</div>
        )}
      </div>
    )
  },
)
