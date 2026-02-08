'use client'

import { Button } from '@make-the-change/core/ui'
import { useTranslations } from 'next-intl'
import { type CSSProperties, type ReactNode, useCallback, useRef } from 'react'
import { useScrollCondensed } from '@/hooks/use-scroll-condensed'
import { cn } from '@make-the-change/core/shared/utils'
import {
  type BreadcrumbItem,
  HeaderAvatar,
  HeaderAvatarGroup,
  HeaderBreadcrumbs,
  HeaderCover,
  HeaderCoverOverlay,
} from './header-components'
import { ImageUploader } from './image-uploader'

export type { BreadcrumbItem }

export type EntityCoverSectionProps = {
  /**
   * Image de couverture (dataURL ou URL)
   */
  heroImage?: string | null

  /**
   * Image d'avatar (dataURL ou URL)
   */
  avatarImage?: string | null

  /**
   * Breadcrumbs à afficher en haut
   */
  breadcrumbs?: BreadcrumbItem[]

  /**
   * Actions à afficher en bas à droite de la cover
   */
  actions?: ReactNode

  /**
   * Contenu supplémentaire à afficher dans le header overlay
   */
  headerContent?: ReactNode

  /**
   * Handler pour l'upload de la couverture
   */
  onHeroUpload?: (files: FileList | null) => void | Promise<void>

  /**
   * Handler pour l'upload de l'avatar
   */
  onAvatarUpload?: (files: FileList | null) => void | Promise<void>

  /**
   * Handler pour la suppression de la couverture
   */
  onHeroRemove?: () => void

  /**
   * Handler pour la suppression de l'avatar
   */
  onAvatarRemove?: () => void

  /**
   * État de chargement de la couverture
   */
  isHeroLoading?: boolean

  /**
   * État de chargement de l'avatar
   */
  isAvatarLoading?: boolean

  /**
   * Activer le mode condensé au scroll
   */
  enableCondensed?: boolean

  /**
   * Seuil de scroll pour le mode condensé (px)
   */
  condensedThreshold?: number

  /**
   * Classe CSS personnalisée pour le conteneur
   */
  className?: string

  /**
   * Style inline pour le conteneur
   */
  style?: CSSProperties

  /**
   * Désactiver toutes les interactions
   */
  disabled?: boolean

  /**
   * Classes CSS personnalisées pour les sous-éléments
   */
  classes?: {
    cover?: string
    avatar?: string
    overlay?: string
    actions?: string
  }
}

/**
 * Section de couverture réutilisable pour toutes les entités admin
 *
 * Supporte :
 * - Upload/suppression de hero et avatar
 * - Mode condensé au scroll
 * - Breadcrumbs
 * - Actions personnalisées
 * - Animations fluides
 * - Accessibilité complète
 */
export function EntityCoverSection({
  heroImage,
  avatarImage,
  breadcrumbs,
  actions,
  headerContent,
  onHeroUpload,
  onAvatarUpload,
  onHeroRemove,
  onAvatarRemove,
  isHeroLoading = false,
  isAvatarLoading = false,
  enableCondensed = true,
  condensedThreshold = 80,
  className,
  style,
  disabled = false,
  classes,
}: EntityCoverSectionProps) {
  const t = useTranslations()

  const heroInputRef = useRef<HTMLInputElement | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  // Hook de détection de scroll
  const { isCondensed } = useScrollCondensed({
    threshold: condensedThreshold,
    hysteresis: 30,
  })

  const shouldCondense = enableCondensed && isCondensed

  // Handlers
  const handleHeroClick = useCallback(() => {
    if (disabled || isHeroLoading) return
    if (heroInputRef.current) {
      heroInputRef.current.value = ''
      heroInputRef.current.click()
    }
  }, [disabled, isHeroLoading])

  const handleAvatarClick = useCallback(() => {
    if (disabled || isAvatarLoading) return
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
      avatarInputRef.current.click()
    }
  }, [disabled, isAvatarLoading])

  const handleHeroChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void onHeroUpload?.(e.target.files)
    },
    [onHeroUpload],
  )

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void onAvatarUpload?.(e.target.files)
    },
    [onAvatarUpload],
  )

  return (
    <>
      {/* Sticky Header */}
      <HeaderCover
        className={cn('sticky top-0 z-30 transition-all duration-500 ease-out', className)}
        style={{
          ...style,
          willChange: shouldCondense ? 'transform' : 'auto',
          transform: 'translateZ(0)', // GPU acceleration
        }}
      >
        {/* Cover Image Container */}
        <div
          className={cn(
            'relative overflow-hidden transition-all duration-500 ease-out',
            shouldCondense ? 'h-[60px] md:h-[110px]' : 'h-[320px] md:h-[360px]',
            classes?.cover,
          )}
          style={{
            transformOrigin: 'top center',
          }}
        >
          {/* Cover Image Uploader */}
          <ImageUploader
            imageSrc={heroImage}
            size="cover"
            isLoading={isHeroLoading}
            disabled={disabled}
            onImageClick={handleHeroClick}
            onRemove={onHeroRemove}
            containerClassName="absolute inset-0 z-[1]"
            className="h-full w-full"
          />

          {/* Overlay Gradient */}
          <HeaderCoverOverlay
            className={cn('from-black/70 via-black/35 to-black/10 z-[5]', classes?.overlay)}
          />

          {/* Actions en bas à droite */}
          {actions && (
            <div
              className={cn(
                'absolute bottom-4 right-4 z-[6] flex items-center gap-3 pointer-events-auto md:bottom-6 md:right-8',
                classes?.actions,
              )}
            >
              {actions}
            </div>
          )}
        </div>

        {/* Content Overlay (Breadcrumbs + Header Content) */}
        {(breadcrumbs || headerContent) && (
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between transition-all duration-500 ease-out',
              shouldCondense ? 'px-4 py-3 md:px-6' : 'px-4 py-6 md:px-8',
            )}
          >
            {/* Breadcrumbs en haut */}
            {breadcrumbs && (
              <div
                className={cn(
                  'flex flex-wrap items-center gap-3 text-white/90 pointer-events-auto transition-all duration-300',
                  shouldCondense ? 'mt-1 md:mt-2' : 'mt-2',
                )}
              >
                <HeaderBreadcrumbs items={breadcrumbs} className="text-white/80" />
              </div>
            )}

            {/* Contenu personnalisé */}
            {headerContent && <div className="pointer-events-auto">{headerContent}</div>}
          </div>
        )}

        {/* Avatar Group */}
        <HeaderAvatarGroup
          className={cn(
            'relative z-40 transition-all duration-500 ease-out',
            shouldCondense ? 'pb-3' : 'pb-8',
            classes?.avatar,
          )}
          style={{
            marginTop: '-80px',
          }}
        >
          <div
            className={cn(
              'transition-transform duration-500 ease-out',
              disabled && 'pointer-events-none opacity-60',
            )}
            style={{
              transform: shouldCondense ? 'scale(0.6)' : 'scale(1)',
              transformOrigin: 'left center',
            }}
          >
            <HeaderAvatar size="xl" className="relative overflow-hidden">
              <ImageUploader
                imageSrc={avatarImage}
                size="avatar"
                isLoading={isAvatarLoading}
                disabled={disabled}
                onImageClick={handleAvatarClick}
                onRemove={onAvatarRemove}
                containerClassName="h-full w-full"
                className="rounded-full"
              />
            </HeaderAvatar>
          </div>
        </HeaderAvatarGroup>

        {/* Hidden File Inputs */}
        <input
          ref={heroInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleHeroChange}
          disabled={disabled || isHeroLoading}
        />
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={disabled || isAvatarLoading}
        />
      </HeaderCover>
    </>
  )
}

/**
 * Composant simple pour créer un bouton de retour avec breadcrumbs
 */
export type EntityCoverBackButtonProps = {
  label?: string
  onClick: () => void
  className?: string
}

export function EntityCoverBackButton({ label, onClick, className }: EntityCoverBackButtonProps) {
  const t = useTranslations()

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        'border-white/40 bg-white/10 text-white hover:bg-white/20 transition-colors',
        className,
      )}
      onClick={onClick}
    >
      {label ?? t('admin.cover.back', { defaultValue: 'Retour' })}
    </Button>
  )
}

/**
 * Export d'un objet composé pour usage avec pattern de composition
 */
export const CoverSection = Object.assign(EntityCoverSection, {
  BackButton: EntityCoverBackButton,
})
