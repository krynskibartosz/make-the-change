'use client'

import { Camera, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@make-the-change/core/shared/utils'

export type ImageUploaderSize = 'cover' | 'avatar'

export type ImageUploaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'children'> & {
  /**
   * Source de l'image (dataURL ou URL)
   */
  imageSrc?: string | null

  /**
   * Type d'uploader pour ajuster le layout
   */
  size?: ImageUploaderSize

  /**
   * État de chargement
   */
  isLoading?: boolean

  /**
   * Label pour l'ajout d'image
   */
  addLabel?: string

  /**
   * Label pour l'édition d'image
   */
  editLabel?: string

  /**
   * Handler pour le clic (ouverture du file picker)
   */
  onImageClick?: () => void

  /**
   * Handler pour la suppression
   */
  onRemove?: () => void

  /**
   * Désactiver les interactions
   */
  disabled?: boolean

  /**
   * Classe CSS pour le conteneur
   */
  containerClassName?: string
}

/**
 * Composant réutilisable pour l'upload d'images avec overlay
 *
 * Supporte :
 * - Placeholder avec icône Camera
 * - Preview de l'image
 * - Overlay au hover
 * - Bouton de suppression
 * - États de chargement
 * - Accessibilité (a11y)
 *
 * @example
 * ```tsx
 * <ImageUploader
 *   imageSrc={heroImage}
 *   size="cover"
 *   isLoading={isUploading}
 *   onImageClick={() => inputRef.current?.click()}
 *   onRemove={() => removeImage()}
 * />
 * ```
 */
export const ImageUploader = forwardRef<HTMLDivElement, ImageUploaderProps>(
  (
    {
      imageSrc,
      size = 'cover',
      isLoading = false,
      addLabel,
      editLabel,
      onImageClick,
      onRemove,
      disabled = false,
      containerClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations()

    const defaultAddLabel =
      size === 'cover'
        ? t('admin.cover.add_cover', {
            defaultValue: 'Cliquez pour ajouter une couverture',
          })
        : t('admin.cover.add_avatar', {
            defaultValue: 'Ajouter un avatar',
          })

    const defaultEditLabel =
      size === 'cover'
        ? t('admin.cover.edit_cover', {
            defaultValue: 'Modifier la couverture',
          })
        : t('admin.cover.edit_avatar', {
            defaultValue: "Modifier l'avatar",
          })

    const displayAddLabel = addLabel ?? defaultAddLabel
    const displayEditLabel = editLabel ?? defaultEditLabel

    const hasImage = typeof imageSrc === 'string' && imageSrc.length > 0
    const isInteractive = !disabled && !isLoading

    const iconSize = size === 'cover' ? 'h-10 w-10' : 'h-6 w-6'
    const textSize = size === 'cover' ? 'text-sm' : 'text-xs'

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        aria-label={hasImage ? displayEditLabel : displayAddLabel}
        onClick={isInteractive ? onImageClick : undefined}
        onKeyDown={(e) => {
          if (!isInteractive) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onImageClick?.()
          }
        }}
        className={cn(
          'group relative transition-all duration-300',
          // Radius: Use Bento standard for cover, full for avatar
          size === 'cover' ? 'rounded-3xl' : 'rounded-full',
          // Interactive state: Cursor pointer
          isInteractive && 'cursor-pointer',
          disabled && 'pointer-events-none opacity-60',
          containerClassName,
        )}
        {...props}
      >
        {/* Image ou Placeholder */}
        <div
          className={cn(
            'relative h-full w-full overflow-hidden transition-all duration-300',
            size === 'cover' ? 'rounded-3xl' : 'rounded-full',
            size === 'cover' && 'aspect-video',
            // Borders: Moved to inner div
            'border-2 border-dashed',
            size === 'cover'
              ? 'border-muted-foreground/50 dark:border-border'
              : 'border-input dark:border-border',
            // Interactive state: Hover border primary
            isInteractive && 'group-hover:border-primary/50 group-hover:bg-accent/5',
            className,
          )}
        >
          {hasImage ? (
            <>
              {/* Image */}
              <Image
                src={imageSrc as string}
                alt={size === 'cover' ? 'Couverture' : 'Avatar'}
                fill
                priority={size === 'cover'}
                className={cn(
                  'object-cover transition-all duration-500',
                  isInteractive && 'group-hover:scale-105',
                  size === 'avatar' && 'rounded-full',
                )}
                sizes={size === 'cover' ? '100vw' : '200px'}
              />

              {/* Overlay au hover */}
              {isInteractive && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-xs opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none',
                    size === 'avatar' && 'rounded-full',
                  )}
                >
                  <div className="flex cursor-pointer flex-col items-center gap-2 text-white">
                    <Camera color="green" className={iconSize} />
                    {displayEditLabel && (
                      <p className={cn('font-medium', textSize)}>{displayEditLabel}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Placeholder */
            <div
              className={cn(
                'flex h-full w-full items-center justify-center text-muted-foreground transition-all duration-300',
                // Background: Stronger opacity for light mode (20%) vs Dark mode (5%)
                'bg-linear-to-br from-primary/20 via-accent/20 to-primary/20 dark:from-primary/5 dark:via-accent/5 dark:to-primary/5',
                // Hover: Slightly darker/more opaque on hover
                isInteractive &&
                  'group-hover:from-primary/25 group-hover:via-accent/25 group-hover:to-primary/25',
                size === 'avatar' && 'rounded-full',
              )}
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className={cn(iconSize, 'animate-spin text-primary')} />
                  {size === 'cover' && (
                    <p className={cn('font-medium', textSize)}>
                      {t('admin.cover.loading', {
                        defaultValue: 'Chargement...',
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 group-hover:text-primary transition-colors">
                  <Camera color="#059669 " className={iconSize} />
                  {size === 'cover' && displayAddLabel && (
                    <p className={cn('font-medium', textSize)}>{displayAddLabel}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bouton de suppression (Outside overflow-hidden) */}
        {hasImage && onRemove && isInteractive && (
          <button
            type="button"
            aria-label={t('admin.cover.remove', {
              defaultValue: 'Retirer',
            })}
            className={cn(
              'absolute cursor-pointer z-20 flex h-8 w-8 items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100',
              // Use glass-panel utility + specific hover states
              'glass-panel text-foreground hover:bg-destructive hover:text-destructive-foreground hover:scale-110 hover:border-destructive/50',
              size === 'cover' && 'right-4 top-4',
              size === 'avatar' && 'right-2 top-2',
            )}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)

ImageUploader.displayName = 'ImageUploader'
