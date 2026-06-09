'use client'

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ChoiceCardProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Readonly<{
    children: ReactNode
    description?: ReactNode
    selected?: boolean
  }>

export const ChoiceCard = forwardRef<HTMLButtonElement, ChoiceCardProps>(function ChoiceCard(
  { children, className, description, selected = false, type = 'button', ...props },
  ref,
) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={cn(
        'flex min-h-[var(--size-primary-button)] w-full items-start rounded-[var(--radius-card)] border px-4 py-3 text-left transition-colors disabled:opacity-50',
        selected
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-surface text-foreground',
        className,
      )}
      ref={ref}
      type={type}
    >
      <span className="flex flex-col gap-1">
        <span className="text-base font-semibold leading-6">{children}</span>
        {description ? (
          <span className="text-sm leading-5 text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </button>
  )
})
