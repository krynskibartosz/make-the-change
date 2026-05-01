'use client'

import { Button } from '@make-the-change/core/ui'
import { Clock, Flame } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { QuantityStepper } from '@/app/[locale]/(tabs)/products/_components/quantity-stepper'
import { formatCurrency } from '@/lib/utils'

interface ProductCartPayload {
  productId: string
  productName: string
  productSlug?: string | null
  pricePoints: number
  priceEuros?: number | null
  imageUrl: string | null
  fulfillmentMethod?: string | null
  stockQuantity?: number | null
  inStock: boolean
}

interface ProductDetailAddToCartButtonProps extends ProductCartPayload {
  className?: string
}

interface FloatingActionButtonsProps extends ProductCartPayload {
  displayPrice: number
}

const normalizePricePoints = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

const normalizePriceEuros = (value: number | null | undefined) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : null

function useProductAddToCart({
  productId,
  productName,
  productSlug,
  pricePoints,
  priceEuros,
  imageUrl,
  fulfillmentMethod,
  stockQuantity,
  inStock,
}: ProductCartPayload) {
  const t = useTranslations('products')
  const [quantity, setQuantity] = useState(0)

  const handleIncrement = () => {
    if (!inStock) return
    if (stockQuantity && quantity >= stockQuantity) return
    setQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity <= 1) {
      setQuantity(0)
    } else {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = () => {
    handleIncrement()
    // Cart functionality removed - TODO: implement alternative
  }

  return { addToCart, handleIncrement, handleDecrement, quantity, t }
}

export function ProductDetailAddToCartButton({
  className,
  ...payload
}: ProductDetailAddToCartButtonProps) {
  const { addToCart, handleIncrement, handleDecrement, quantity, t } = useProductAddToCart(payload)

  if (quantity > 0) {
    const quantityStepperProps = {
      quantity,
      onIncrement: handleIncrement,
      onDecrement: handleDecrement,
      ...(payload.stockQuantity !== undefined ? { maxQuantity: payload.stockQuantity } : {}),
      ...(className !== undefined ? { className } : {}),
    }

    return <QuantityStepper {...quantityStepperProps} />
  }

  return (
    <Button className={className} size="lg" disabled={!payload.inStock} onClick={addToCart}>
      {payload.inStock ? (
        <>
          <Flame className="mr-2 h-5 w-5" />
          {t('card.add_to_cart')}
        </>
      ) : (
        <>
          <Clock className="mr-2 h-5 w-5" />
          {t('card.out_of_stock')}
        </>
      )}
    </Button>
  )
}

export function FloatingActionButtons({ displayPrice, ...payload }: FloatingActionButtonsProps) {
  const { addToCart, handleIncrement, handleDecrement, quantity, t } = useProductAddToCart(payload)
  const displayPoints = payload.pricePoints ?? 0

  if (quantity > 0) {
    const quantityStepperProps = {
      quantity,
      onIncrement: handleIncrement,
      onDecrement: handleDecrement,
      className: 'h-14 w-full shadow-lg',
      ...(payload.stockQuantity !== undefined ? { maxQuantity: payload.stockQuantity } : {}),
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-lg md:hidden">
        <QuantityStepper {...quantityStepperProps} />
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-lg md:hidden">
      {/* Scarcity indicator */}
      {payload.inStock && (
        <div className="mb-3 flex items-center justify-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[11px] font-black uppercase tracking-wide text-orange-400">
            Série Limitée — Plus que 12 exemplaires
          </span>
        </div>
      )}
      {/* Price hierarchy: Points primary, euros secondary */}
      <div className="mb-3 flex items-baseline justify-center gap-2">
        <span className="text-2xl font-bold text-lime-400">
          {displayPoints.toLocaleString('fr-FR')} Points
        </span>
        {displayPrice > 0 && (
          <span className="text-sm text-muted-foreground">ou {formatCurrency(displayPrice)}</span>
        )}
      </div>
      <Button
        className="h-14 w-full rounded-full bg-primary text-lg font-bold text-marketing-overlay-light shadow-lg transition-all duration-300 hover:bg-primary/90"
        disabled={!payload.inStock}
        onClick={addToCart}
      >
        {payload.inStock ? (
          <>
            <Flame className="mr-3 h-6 w-6" />
            {t('card.add_to_cart')}
          </>
        ) : (
          <>
            <Clock className="mr-3 h-6 w-6" />
            {t('card.out_of_stock')}
          </>
        )}
      </Button>
    </div>
  )
}
