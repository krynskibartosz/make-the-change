'use client'

import { Button } from '@make-the-change/core/ui'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuantityStepperProps = {
  quantity: number
  maxQuantity?: number | null
  onIncrement: () => void
  onDecrement: () => void
  className?: string
  size?: 'default' | 'lg'
}

export function QuantityStepper({
  quantity,
  maxQuantity,
  onIncrement,
  onDecrement,
  className,
  size = 'lg',
}: QuantityStepperProps) {
  const isDeleteAction = quantity === 1
  const isMaxReached = typeof maxQuantity === 'number' && quantity >= maxQuantity

  return (
    <div
      role="group"
      aria-label="Sélecteur de quantité"
      className={cn(
        'flex items-center justify-between rounded-xl border border-input bg-background shadow-sm',
        size === 'lg' ? 'h-12 w-full' : 'h-10 w-full',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onDecrement()
        }}
        className={cn(
          'h-full rounded-r-none hover:bg-muted text-muted-foreground transition-colors',
          size === 'lg' ? 'w-12' : 'w-10',
          isDeleteAction && 'text-destructive hover:text-destructive hover:bg-destructive/10',
        )}
        aria-label={isDeleteAction ? "Supprimer l'article" : "Diminuer la quantité"}
      >
        {isDeleteAction ? (
          <Trash2 className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden="true" />
        ) : (
          <Minus className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden="true" />
        )}
      </Button>

      <span className={cn('font-bold', size === 'lg' ? 'text-lg' : 'text-base')}>{quantity}</span>

      <Button
        variant="ghost"
        size="icon"
        disabled={isMaxReached}
        onClick={(e) => {
          e.stopPropagation()
          if (!isMaxReached) onIncrement()
        }}
        aria-label="Augmenter la quantité"
        className={cn(
          'h-full rounded-l-none hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50',
          size === 'lg' ? 'w-12' : 'w-10',
        )}
      >
        <Plus className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden="true" />
      </Button>
    </div>
  )
}
