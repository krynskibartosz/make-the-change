'use client'

import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

import { IconButton } from './button'

type NumberStepperProps = Readonly<{
  ariaLabel: string
  className?: string
  disabled?: boolean
  formatValue?: (value: number) => string
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}>

export function NumberStepper({
  ariaLabel,
  className,
  disabled = false,
  formatValue = (value) => String(value),
  max,
  min,
  onChange,
  step = 1,
  value,
}: NumberStepperProps) {
  const canDecrement = !disabled && (min === undefined || value - step >= min)
  const canIncrement = !disabled && (max === undefined || value + step <= max)

  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn(
        'inline-flex min-h-[var(--size-input)] items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface p-1',
        className,
      )}
    >
      <IconButton
        aria-label="Diminuer"
        className="size-10"
        disabled={!canDecrement}
        onClick={() => onChange(value - step)}
        variant="ghost"
      >
        <Minus aria-hidden="true" className="size-4" />
      </IconButton>
      <output className="min-w-12 text-center font-mono text-base font-semibold text-foreground">
        {formatValue(value)}
      </output>
      <IconButton
        aria-label="Augmenter"
        className="size-10"
        disabled={!canIncrement}
        onClick={() => onChange(value + step)}
        variant="ghost"
      >
        <Plus aria-hidden="true" className="size-4" />
      </IconButton>
    </fieldset>
  )
}
