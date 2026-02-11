'use client'

import { Button } from '@make-the-change/core/ui'
import { ShoppingCart, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FloatingActionButtonsProps {
  productId: string
  displayPrice: number
  inStock: boolean
}

export function FloatingActionButtons({ 
  productId, 
  displayPrice, 
  inStock 
}: FloatingActionButtonsProps) {
  const addToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 p-4 md:hidden">
      <Button
        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg text-white font-bold text-lg"
        disabled={!inStock}
        onClick={addToCart}
      >
        {inStock ? (
          <>
            <ShoppingCart className="mr-3 h-6 w-6" />
            Ajouter au panier - {formatCurrency(displayPrice)}
          </>
        ) : (
          <>
            <Clock className="mr-3 h-6 w-6" />
            Rupture de stock
          </>
        )}
      </Button>
    </div>
  )
}
