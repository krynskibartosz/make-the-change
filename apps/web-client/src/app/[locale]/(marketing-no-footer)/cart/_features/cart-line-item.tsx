'use client'

import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { Trash2 } from 'lucide-react'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'
import type { CartItemSnapshot } from './cart-types'
import { QuantityStepper } from './quantity-stepper'

type CartLineItemProps = {
  item: CartItemSnapshot
  onQuantityChange: (next: number) => void
  onRemove: () => void
  density?: 'default' | 'compact'
  layout?: 'default' | 'desktop'
  className?: string
}

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  density = 'default',
  layout = 'default',
  className,
}: CartLineItemProps) {
  const total = (item.snapshot.pricePoints || 0) * (item.quantity || 0)
  const totalEuros = item.snapshot.priceEuros
    ? item.snapshot.priceEuros * (item.quantity || 0)
    : undefined
  const maxQty = item.snapshot.stockQuantity ?? 20
  const isOutOfStock = isOutOfStockSnapshot(item.snapshot.stockQuantity)
  const showLowStock =
    item.snapshot.stockQuantity !== null &&
    item.snapshot.stockQuantity !== undefined &&
    item.snapshot.stockQuantity > 0 &&
    item.snapshot.stockQuantity <= 10

  if (layout === 'desktop') {
    return (
      <Card
        className={cn(
          'border border-border/50 bg-background/70 shadow-sm backdrop-blur-md transition-all',
          isOutOfStock && 'border-destructive/25 opacity-70 bg-destructive/5',
          className,
        )}
      >
        <CardContent className="p-4 xl:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_176px_140px_44px] items-center gap-4 xl:gap-6">
            <div className="min-w-0 flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted border border-client-white/10 shadow-inner xl:h-24 xl:w-24">
                {item.snapshot.imageUrl ? (
                  <img
                    src={item.snapshot.imageUrl}
                    alt={item.snapshot.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-client-emerald-500/10" />
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="truncate text-2xl font-bold tracking-tight text-foreground">
                  {item.snapshot.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md">
                    #{item.productId.slice(0, 8)}
                  </p>
                  {isOutOfStock ? (
                    <Badge
                      variant="destructive"
                      className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                    >
                      Rupture de stock
                    </Badge>
                  ) : showLowStock ? (
                    <Badge
                      variant="outline"
                      className="text-client-orange-500 border-client-orange-500/30 bg-client-orange-500/5 rounded-full px-2 py-0 text-[10px]"
                    >
                      Plus que {item.snapshot.stockQuantity}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="justify-self-center">
              <QuantityStepper
                value={item.quantity}
                onChange={onQuantityChange}
                max={maxQty}
                disabled={isOutOfStock}
              />
            </div>

            <div className="justify-self-end text-right">
              <p className="text-2xl font-black text-primary tabular-nums tracking-tight">
                {formatPoints(total)}{' '}
                <span className="text-xs font-bold text-muted-foreground/70">pts</span>
              </p>
              {totalEuros !== undefined && (
                <p className="text-xs text-muted-foreground font-medium tabular-nums">
                  ~ {formatCurrency(totalEuros)}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-10 w-10 justify-self-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Retirer du panier"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'border border-border/50 bg-background/60 shadow-sm backdrop-blur-md transition-all',
        isOutOfStock && 'border-destructive/25 opacity-70 bg-destructive/5',
        className,
      )}
    >
      <CardContent className={cn('flex gap-5 items-center', density === 'compact' ? 'p-3' : 'p-5')}>
        <div
          className={cn(
            'shrink-0 overflow-hidden rounded-2xl bg-muted border border-client-white/10 shadow-inner',
            density === 'compact' ? 'h-16 w-16' : 'h-24 w-24 sm:h-28 sm:w-28',
          )}
        >
          {item.snapshot.imageUrl ? (
            <img
              src={item.snapshot.imageUrl}
              alt={item.snapshot.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-client-emerald-500/10" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-lg font-bold text-foreground tracking-tight">
              {item.snapshot.name}
            </p>

            {isOutOfStock ? (
              <Badge
                variant="destructive"
                className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
              >
                Rupture de stock
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <p className="hidden text-xs text-muted-foreground sm:block font-mono bg-muted/50 px-2 py-0.5 rounded-md">
                  #{item.productId.slice(0, 8)}
                </p>
                {showLowStock && (
                  <Badge
                    variant="outline"
                    className="text-client-orange-500 border-client-orange-500/30 bg-client-orange-500/5 rounded-full px-2 py-0 text-[10px]"
                  >
                    Plus que {item.snapshot.stockQuantity}
                  </Badge>
                )}
              </div>
            )}

            <div className="sm:hidden pt-2">
              <div className="text-sm font-bold text-primary tabular-nums">
                {formatPoints(total)} pts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <QuantityStepper
              value={item.quantity}
              onChange={onQuantityChange}
              max={maxQty}
              disabled={isOutOfStock}
            />

            <div className="hidden sm:flex flex-col items-end min-w-[80px]">
              <p className="text-lg font-black text-primary tabular-nums tracking-tight">
                {formatPoints(total)}{' '}
                <span className="text-xs font-bold text-muted-foreground/70">pts</span>
              </p>
              {totalEuros !== undefined && (
                <p className="text-xs text-muted-foreground font-medium tabular-nums">
                  ~ {formatCurrency(totalEuros)}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Retirer du panier"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
