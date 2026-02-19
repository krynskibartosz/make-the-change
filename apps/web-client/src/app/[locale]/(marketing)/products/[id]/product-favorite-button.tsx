'use client'

import { Button } from '@make-the-change/core/ui'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type ProductFavoriteButtonProps = {
  productId: string
  productName: string
  className?: string
}

const readFavoriteIds = (): string[] => {
  const raw = JSON.parse(localStorage.getItem('product_favorites') || '[]') as unknown
  return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : []
}

export function ProductFavoriteButton({
  productId,
  productName,
  className,
}: ProductFavoriteButtonProps) {
  const t = useTranslations('products.detail_page')
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Load initial state from local storage
  useEffect(() => {
    setIsMounted(true)
    const favorites = readFavoriteIds()
    setIsFavorite(favorites.includes(productId))
  }, [productId])

  const toggleFavorite = () => {
    const favorites = readFavoriteIds()
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== productId)
      toast({
        title: t('removed_from_favorites'),
        description: t('removed_from_favorites_desc', { name: productName }),
        variant: 'default',
      })
    } else {
      newFavorites = [...favorites, productId]
      toast({
        title: t('added_to_favorites'),
        description: t('added_to_favorites_desc', { name: productName }),
        variant: 'success', // Assuming 'success' variant exists, otherwise 'default'
      })
    }

    localStorage.setItem('product_favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  if (!isMounted) {
    return (
      <Button variant="outline" size="icon" className={className} disabled>
        <Heart className="h-5 w-5" />
        <span className="sr-only">{t('add_to_favorites')}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'transition-colors duration-300',
        isFavorite &&
          'border-marketing-positive-500/20 bg-marketing-positive-50 text-marketing-positive-500 hover:bg-marketing-positive-100 hover:text-marketing-positive-600',
        className,
      )}
      onClick={toggleFavorite}
      title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-300',
          isFavorite ? 'fill-current scale-110' : 'scale-100',
        )}
      />
      <span className="sr-only">
        {isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
      </span>
    </Button>
  )
}
