'use client'

import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { Trash2 } from 'lucide-react'
import { cn, formatPoints } from '@/lib/utils'
import type { CartItemSnapshot } from './cart-types'
import { QuantityStepper } from './quantity-stepper'

type CartLineItemProps = {
  item: CartItemSnapshot
  onQuantityChange: (next: number) => void
  onRemove: () => void
  density?: 'default' | 'compact'
  className?: string
}

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  density = 'default',
  className,
}: CartLineItemProps) {
  const total = (item.snapshot.pricePoints || 0) * (item.quantity || 0)
  const maxQty = item.snapshot.stockQuantity ?? 20
  const isOutOfStock = isOutOfStockSnapshot(item.snapshot.stockQuantity)
  const showLowStock =
    item.snapshot.stockQuantity !== null &&
    item.snapshot.stockQuantity !== undefined &&
    item.snapshot.stockQuantity > 0 &&
    item.snapshot.stockQuantity <= 10

  return (
    <Card
      className={cn(
        'border bg-background/70 shadow-sm backdrop-blur',
        isOutOfStock && 'border-destructive/25 opacity-70',
        className,
      )}
    >
      <CardContent className={cn('flex gap-4', density === 'compact' ? 'p-3' : 'p-4 sm:p-5')}>
        <div
          className={cn(
            'shrink-0 overflow-hidden rounded-2xl bg-muted',
            density === 'compact' ? 'h-16 w-16' : 'h-20 w-20 sm:h-24 sm:w-24',
          )}
        >
          {item.snapshot.imageUrl ? (
            <img
              src={item.snapshot.imageUrl}
              alt={item.snapshot.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{item.snapshot.name}</p>
              {isOutOfStock ? (
                <p className="mt-1 text-xs font-medium text-destructive">Rupture de stock</p>
              ) : (
                <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
                  #{item.productId.slice(0, 8)}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Retirer du panier"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <QuantityStepper
              value={item.quantity}
              onChange={onQuantityChange}
              max={maxQty}
              disabled={isOutOfStock}
            />
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {showLowStock ? (
                <Badge variant="secondary" className="rounded-full">
                  Plus que {item.snapshot.stockQuantity}
                </Badge>
              ) : null}
              <p className="text-sm font-semibold text-primary tabular-nums">
                {formatPoints(total)} pts
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
