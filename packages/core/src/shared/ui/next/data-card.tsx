'use client'

import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentType, FC, KeyboardEvent, MouseEvent, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { cn } from '../utils'
import { isCardInteractiveTarget } from './card-interaction'

type LinkComponentProps = {
  href: string
  className?: string
  tabIndex?: number
  'aria-label'?: string
}

export type DataCardProps = {
  className?: string
  href?: string
  onClick?: () => void
  image?: string
  imageAlt?: string
  LinkComponent?: ComponentType<LinkComponentProps>
  linkAriaLabel?: string
}

const DataCardComponent: FC<PropsWithChildren<DataCardProps>> = ({
  children,
  className,
  href,
  onClick,
  image,
  imageAlt,
  LinkComponent = NextLink,
  linkAriaLabel = 'View details',
}) => {
  const router = useRouter()

  const activateCard = useCallback(() => {
    if (href) {
      router.push(href)
    }

    onClick?.()
  }, [href, onClick, router])

  const baseClasses = cn(
    // Base styling with dark theme support
    'group relative bg-background dark:bg-card border border-[hsl(var(--border)/0.5)] dark:border-[hsl(var(--border)/0.3)] rounded-xl p-6 overflow-hidden h-full flex flex-col',

    // Transitions and transforms
    'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:dark:hover:border-[hsl(var(--border)/0.5)]',
    'hover:-translate-y-2',

    // Active states with dark theme
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_10px_rgb(0,0,0,0.1)] dark:active:shadow-[0_2px_10px_rgb(0,0,0,0.4)]',
    'active:duration-100 active:ease-out',
    'will-change-transform',
  )

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isCardInteractiveTarget(event.target, event.currentTarget)) {
        return
      }

      activateCard()
    },
    [activateCard],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (isCardInteractiveTarget(event.target, event.currentTarget)) {
          return
        }
        activateCard()
      }
    },
    [activateCard],
  )

  const CardContent = () => (
    <>
      {/* Image d'arrière-plan */}
      {image && imageAlt && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden [border-radius:var(--radius-surface)_var(--radius-surface)_0_0] opacity-10 md:group-hover:opacity-20 transition-opacity duration-300">
          <Image
            fill
            alt={imageAlt}
            className="object-cover scale-110"
            src={image}
            unoptimized={image.includes('unsplash') || image.includes('supabase')}
          />
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative flex flex-col h-full [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10">
        {children}
      </div>
    </>
  )

  return (
    <div
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      className={cn(baseClasses, className, (href || onClick) && 'cursor-pointer')}
      onClick={href || onClick ? handleCardClick : undefined}
      onKeyDown={href || onClick ? handleKeyDown : undefined}
    >
      {/* Invisible navigation overlay */}
      {href && (
        <LinkComponent
          aria-label={linkAriaLabel}
          className="absolute inset-0 z-10 block rounded-[var(--radius-surface)]"
          href={href}
          tabIndex={-1}
        />
      )}
      <CardContent />
    </div>
  )
}

type DataCardHeaderProps = {
  className?: string
}

const DataCardHeader: FC<PropsWithChildren<DataCardHeaderProps>> = ({ children, className }) => (
  <div className={cn('flex items-start justify-between mb-6', className)}>{children}</div>
)

type DataCardTitleProps = {
  icon?: LucideIcon
  image?: string
  imageAlt?: string
  className?: string
}

const DataCardTitle: FC<PropsWithChildren<DataCardTitleProps>> = ({
  children,
  icon: Icon,
  image,
  imageAlt,
  className,
}) => {
  const shouldShowIcon = Icon && !image
  const shouldShowImage = image && imageAlt

  return (
    <div className="flex w-full items-center gap-3 relative">
      {shouldShowImage && (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            unoptimized={image.includes('unsplash') || image.includes('supabase')}
          />
        </div>
      )}
      {shouldShowIcon && (
        <div className="w-21 h-21 [border-radius:var(--radius-surface)] bg-gradient-to-br from-primary/10 dark:from-primary/15 to-orange-500/10 dark:to-orange-500/15 flex items-center justify-center border border-primary/20 dark:border-primary/30 flex-shrink-0">
          <Icon className="text-muted-foreground" size={32} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className={cn('text-foreground font-semibold line-clamp-2 text-lg', className)}>
          {children}
        </h2>
      </div>
    </div>
  )
}

type DataCardContentProps = {
  className?: string
}

const DataCardContent: FC<PropsWithChildren<DataCardContentProps>> = ({ children, className }) => (
  <div className={cn('flex flex-col  gap-2 flex-1 mb-4', className)}>{children}</div>
)

type DataCardFooterProps = {
  className?: string
}

const DataCardFooter: FC<PropsWithChildren<DataCardFooterProps>> = ({ children, className }) => (
  <div
    className={cn(
      'border-t px-0 pb-3 text-primary dark:text-primary flex items-center justify-between text-sm font-medium group dark:border-[hsl(var(--border)/0.5)] pt-4 mt-auto',
      className,
    )}
  >
    {children}
  </div>
)

type DataCardContentItemProps = {
  icon: LucideIcon
}

const DataCardContentItem: FC<PropsWithChildren<DataCardContentItemProps>> = ({
  icon: Icon,
  children,
}) => (
  <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <Icon className="h-4 w-4" />
    <span className="[&>a]:md:group-hover:text-primary [&>a]:md:group-hover:underline [&>a]:hover:!text-blue-600 [&>a]:hover:!font-medium [&>a]:transition-all [&>a]:duration-200">
      {children}
    </span>
  </div>
)

export const DataCard = Object.assign(DataCardComponent, {
  Header: DataCardHeader,
  Title: DataCardTitle,
  Content: DataCardContent,
  ContentItem: DataCardContentItem,
  Footer: DataCardFooter,
})
