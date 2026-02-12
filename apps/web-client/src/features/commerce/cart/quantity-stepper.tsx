'use client'

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@make-the-change/core/ui'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuantityStepperProps = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled = false,
  className,
}: QuantityStepperProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <NumberField
        value={value}
        min={min}
        max={max}
        onValueChange={(nextValue) => {
          if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
            onChange(nextValue)
          }
        }}
      >
        <NumberFieldGroup className="inline-flex h-11 items-center overflow-hidden rounded-md border border-input bg-background">
          <NumberFieldDecrement
            className="inline-flex h-full w-11 items-center justify-center border-r border-input text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            disabled={disabled || !canDecrement}
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </NumberFieldDecrement>

          <NumberFieldInput className="h-full w-10 bg-transparent text-center text-sm font-semibold tabular-nums outline-none" />

          <NumberFieldIncrement
            className="inline-flex h-full w-11 items-center justify-center border-l border-input text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            disabled={disabled || !canIncrement}
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
