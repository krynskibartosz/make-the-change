'use client'

import type { Product } from '@make-the-change/core/schema'
import { Badge, Button } from '@make-the-change/core/ui'
import { Heart, Plus, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCartUI } from '@/features/commerce/cart/cart-ui-provider'
import { useCart } from '@/features/commerce/cart/use-cart'
import { Link } from '@/i18n/navigation'
import { getRandomProductImage } from '@/lib/placeholder-images'
import { cn, formatPoints, formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const t = useTranslations('products.card')
  const { addItem } = useCart()
  const { openCart, showSnackbar } = useCartUI()
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0
  const showLowStock =
    product.stock_quantity !== null && product.stock_quantity > 0 && product.stock_quantity <= 5

  const metadata = product.metadata as Record<string, unknown> | null
  const columnImages = (product.images as string[] | null | undefined) || []
  const metadataImages = (metadata?.images as string[] | undefined) || []
  const mainImage =
    columnImages[0] ||
    (metadata?.image_url as string | undefined) ||
    metadataImages[0] ||
    getRandomProductImage(product.name_default?.length || 0)
  const secondaryImage = columnImages[1] || metadataImages[1] || mainImage

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOutOfStock) return

    setIsAdding(true)
    
    // Simulate network delay for better UX feel
    setTimeout(() => {
      addItem({
        productId: product.id,
        quantity: 1,
        snapshot: {
          name: product.name_default || t('default_name'),
          slug: product.slug || '',
          pricePoints: Number(product.price_points || 0),
          priceEuros: product.price_eur_equivalent ? Number(product.price_eur_equivalent) : undefined,
          imageUrl: mainImage,
          fulfillmentMethod: product.fulfillment_method,
          stockQuantity: product.stock_quantity,
        },
      })
      
      showSnackbar({
        message: t('added_message'),
        actionLabel: t('view_action'),
        onAction: openCart,
        durationMs: 3000,
      })
      
      setIsAdding(false)
    }, 400)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn('group flex flex-col gap-3', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary/20">
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name_default || t('default_name')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out',
            isHovered && secondaryImage !== mainImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          )}
          loading={priority ? 'eager' : 'lazy'}
        />
        
        {/* Secondary Image (Hover) */}
        {secondaryImage !== mainImage && (
          <img
            src={secondaryImage}
            alt={product.name_default || t('default_name')}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            )}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="default" className="w-fit bg-primary/90 hover:bg-primary">
              {t('best_seller')}
            </Badge>
          )}
          {showLowStock && (
            <Badge variant="destructive" className="w-fit opacity-90">
              {t('low_stock')}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="w-fit bg-background/80 backdrop-blur">
              {t('sold_out')}
            </Badge>
          )}
        </div>

        {/* Wishlist Button (Visual only for now) */}
        <button
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-destructive"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Toggle wishlist logic here
          }}
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Quick Add Button - Desktop: Slide up, Mobile: Always visible bottom right */}
        <div 
          className={cn(
            "absolute bottom-4 left-4 right-4 z-10 transition-all duration-300 ease-out md:translate-y-4 md:opacity-0",
            isHovered ? "md:translate-y-0 md:opacity-100" : ""
          )}
        >
          <Button 
            className="w-full shadow-lg" 
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
          >
            {isAdding ? (
              <span className="animate-pulse">{t('adding')}</span>
            ) : isOutOfStock ? (
              t('out_of_stock')
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('add_to_cart')}
              </>
            )}
          </Button>
        </div>
        
        {/* Mobile Quick Add (Icon only) */}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-md md:hidden"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
            {product.name_default}
          </h3>
          <div className="flex flex-col items-end shrink-0 ml-2">
            <span className="font-bold text-primary">
              {formatPoints(product.price_points || 0)} pts
            </span>
            {product.price_eur_equivalent && (
              <span className="text-xs text-muted-foreground font-medium">
                {formatCurrency(Number(product.price_eur_equivalent))}
              </span>
            )}
          </div>
        </div>
        
        <p className="line-clamp-1 text-sm text-muted-foreground">
           {product.short_description_default || t('default_description')}
        </p>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
             {product.tags.slice(0, 2).map(tag => (
               <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-foreground border px-1.5 py-0.5 rounded-sm">
                 {tag}
               </span>
             ))}
          </div>
        )}
      </div>
    </Link>
  )
}
