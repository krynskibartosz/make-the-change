'use client'

import { Button } from '@make-the-change/core/ui'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type ProjectFavoriteButtonProps = {
  projectId: string
  projectName: string
  className?: string
}

const STORAGE_KEY = 'project_favorites'

const parseFavorites = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function ProjectFavoriteButton({
  projectId,
  projectName,
  className,
}: ProjectFavoriteButtonProps) {
  const t = useTranslations('products.detail_page')
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const favorites = parseFavorites()
    setIsFavorite(favorites.includes(projectId))
  }, [projectId])

  const toggleFavorite = () => {
    const favorites = parseFavorites()
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== projectId)
      toast({
        title: t('removed_from_favorites'),
        description: t('removed_from_favorites_desc', { name: projectName }),
        variant: 'default',
      })
    } else {
      newFavorites = [...favorites, projectId]
      toast({
        title: t('added_to_favorites'),
        description: t('added_to_favorites_desc', { name: projectName }),
        variant: 'success',
      })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
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
          isFavorite ? 'scale-110 fill-current' : 'scale-100',
        )}
      />
      <span className="sr-only">
        {isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
      </span>
    </Button>
  )
}
