'use client'

import { Button } from '@make-the-change/core/ui'
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
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || !canDecrement}
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || !canIncrement}
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
