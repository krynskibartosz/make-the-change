'use client'

import { Camera, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type ImageUploaderSize = 'cover' | 'avatar'

export type ImageUploaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'children'> & {
  imageSrc?: string | null
  size?: ImageUploaderSize
  isLoading?: boolean
  addLabel?: string
  editLabel?: string
  onImageClick?: () => void
  onRemove?: () => void
  disabled?: boolean
  containerClassName?: string
}

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
    // Basic translations fallback if not available
    const t = useTranslations('profile') || ((key: string) => key)

    const defaultAddLabel = size === 'cover' ? 'Ajouter une couverture' : 'Ajouter'
    const defaultEditLabel = size === 'cover' ? 'Modifier' : 'Modifier'

    const displayAddLabel = addLabel ?? defaultAddLabel
    const displayEditLabel = editLabel ?? defaultEditLabel

    const hasImage = typeof imageSrc === 'string' && imageSrc.length > 0
    const isInteractive = !disabled && !isLoading

    const iconSize = size === 'cover' ? 'h-8 w-8' : 'h-5 w-5'
    const textSize = size === 'cover' ? 'text-sm' : 'text-[10px]'

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        onClick={isInteractive ? onImageClick : undefined}
        className={cn(
          'group relative transition-all duration-300',
          size === 'cover' ? 'rounded-none' : 'rounded-full',
          isInteractive && 'cursor-pointer',
          disabled && 'pointer-events-none opacity-60',
          containerClassName,
        )}
        {...props}
      >
        <div
          className={cn(
            'relative h-full w-full overflow-hidden transition-all duration-300',
            size === 'cover' ? 'rounded-none' : 'rounded-full',
            // No border for cover as requested "pas de border"
            size === 'avatar' && 'border-4 border-background bg-muted',
            className,
          )}
        >
          {hasImage ? (
            <>
              <Image
                src={imageSrc as string}
                alt={size === 'cover' ? 'Couverture' : 'Avatar'}
                fill
                priority={size === 'cover'}
                className={cn(
                  'object-cover transition-all duration-500',
                  isInteractive && 'group-hover:scale-105',
                )}
                sizes={size === 'cover' ? '100vw' : '128px'}
              />

              {isInteractive && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-2 text-foreground">
                    <Camera className={iconSize} />
                    <p className={cn('font-medium', textSize)}>{displayEditLabel}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center text-muted-foreground transition-all duration-300 bg-muted',
                isInteractive && 'group-hover:bg-muted/80',
              )}
            >
              {isLoading ? (
                <Loader2 className={cn(iconSize, 'animate-spin text-primary')} />
              ) : (
                <div className="flex flex-col items-center gap-1 group-hover:text-foreground">
                  <Camera className={iconSize} />
                  {size === 'cover' && (
                    <p className={cn('font-medium', textSize)}>{displayAddLabel}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {hasImage && onRemove && isInteractive && (
          <button
            type="button"
            className={cn(
              'absolute cursor-pointer z-20 flex h-8 w-8 items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 bg-background/80 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm',
              size === 'cover' ? 'right-4 top-4' : '-right-1 -top-1',
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
