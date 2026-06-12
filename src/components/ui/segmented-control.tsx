'use client'

import { Tabs } from '@base-ui/react'

import { cn } from '@/lib/utils/cn'

type SegmentedControlOption = Readonly<{
  disabled?: boolean
  label: React.ReactNode
  value: string
}>

type SegmentedControlProps = Readonly<{
  ariaLabel: string
  className?: string
  onValueChange: (value: string) => void
  options: readonly SegmentedControlOption[]
  value: string
}>

export function SegmentedControl({
  ariaLabel,
  className,
  onValueChange,
  options,
  value,
}: SegmentedControlProps) {
  return (
    <Tabs.Root value={value} onValueChange={onValueChange}>
      <Tabs.List
        aria-label={ariaLabel}
        className={cn(
          'flex max-w-full gap-1 overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface p-1',
          className,
        )}
      >
        {options.map((option) => {
          const isActive = option.value === value

          return (
            <Tabs.Tab
              className={cn(
                'min-h-[var(--size-choice)] shrink-0 rounded-[calc(var(--radius-control)-0.125rem)] px-4 text-sm font-semibold transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground',
              )}
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
              {isActive ? <span className="sr-only">Selectionne</span> : null}
            </Tabs.Tab>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}
