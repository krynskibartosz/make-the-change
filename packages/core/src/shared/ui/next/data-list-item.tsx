'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentType, FC, KeyboardEvent, MouseEvent, PropsWithChildren } from 'react'
import { cn } from '../utils'
import { blurCardContainer, isCardInteractiveTarget } from './card-interaction'

type LinkComponentProps = {
  href: string
  className?: string
  tabIndex?: number
  'aria-label'?: string
}

// DataListItem - Composant pour les vues en liste avec composition
export type DataListItemProps = {
  href?: string
  onClick?: () => void
  className?: string
  LinkComponent?: ComponentType<LinkComponentProps>
  linkAriaLabel?: string
}

const DataListItemComponent: FC<PropsWithChildren<DataListItemProps>> = ({
  children,
  href,
  onClick,
  className,
  LinkComponent = NextLink,
  linkAriaLabel = 'Accéder aux détails de cet élément',
}) => {
  const router = useRouter()

  const activateItem = () => {
    if (href) {
      router.push(href)
    }
    onClick?.()
  }

  const baseClasses = cn(
    // Base layout & behavior
    'group relative cursor-pointer',
    '[padding:var(--density-spacing-md)] [margin:calc(var(--density-spacing-md)*-1)]',
    'rounded-[var(--radius-surface)] border border-transparent',
    'will-change-transform backdrop-blur-sm',

    // Unified transition system 2025
    'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',

    // Modern hover states with design system colors
    'md:hover:bg-gradient-to-r md:hover:from-primary/8 dark:md:hover:from-primary/12 md:hover:via-background/60 dark:md:hover:via-card/80 md:hover:to-accent/5 dark:md:hover:to-accent/8',
    'md:hover:shadow-[var(--shadow-card)] md:hover:shadow-primary/12 dark:md:hover:shadow-black/30',
    'md:hover:border-primary/30 dark:md:hover:border-primary/40 md:hover:scale-[1.001] md:hover:-translate-y-0.5',
    'md:hover:z-10 md:hover:relative',

    // Refined active states
    'active:bg-gradient-to-r active:from-primary/12 dark:active:from-primary/16 active:via-background/70 dark:active:via-card/90 active:to-accent/8 dark:active:to-accent/12',
    'active:shadow-[var(--shadow-surface)] active:shadow-primary/8 dark:active:shadow-black/20',
    'active:border-primary/40 dark:active:border-primary/50 active:scale-[0.999] active:translate-y-0',

    // Enhanced focus with design system - only for keyboard navigation
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:focus-visible:ring-primary/80',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-card',

    // Remove focus styling for mouse interactions
    'focus:not(:focus-visible):ring-0 focus:not(:focus-visible):ring-offset-0',

    // Modern glass effect
    'md:hover:backdrop-blur-md',
    className,
  )

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (isCardInteractiveTarget(event.target, event.currentTarget)) {
      // Remove focus from the container when clicking on interactive elements
      blurCardContainer(event.currentTarget)
      return
    }

    activateItem()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isCardInteractiveTarget(event.target, event.currentTarget)) {
        return
      }
      activateItem()
    }
  }

  return (
    <div
      className={baseClasses}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* Invisible navigation overlay with improved accessibility */}
      {href && (
        <LinkComponent
          aria-label={linkAriaLabel}
          className="absolute inset-0 z-10 block rounded-[var(--radius-surface)]"
          href={href}
          tabIndex={-1}
        />
      )}

      {/* Contenu avec z-index plus élevé */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className="flex-1 min-w-0">{children}</div>

        {/* Modern chevron indicator 2025 */}
        {href && (
          <div className="flex-shrink-0 ml-4 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] md:group-hover:translate-x-1.5 md:group-hover:scale-110 group-active:translate-x-0.5 group-active:scale-105">
            <div className="relative">
              {/* Animated background bubble */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/15 rounded-[var(--radius-pill)] scale-0 opacity-0 md:group-hover:scale-150 md:group-hover:opacity-100 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />

              {/* Enhanced chevron with micro-interaction */}
              <svg
                className="relative z-10 drop-shadow-sm transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="text-primary opacity-50 md:group-hover:opacity-100 md:group-hover:stroke-[3] group-active:opacity-80 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Advanced visual effects 2025 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 dark:via-primary/5 to-accent/2 dark:to-accent/4 opacity-0 md:group-hover:opacity-100 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none rounded-[var(--radius-surface)]" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 dark:via-white/4 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-[var(--transition-slow)] ease-out pointer-events-none rounded-[var(--radius-surface)] translate-x-[-100%] md:group-hover:translate-x-[100%]" />

      {/* Enhanced focus ring */}
      <div className="absolute inset-0 ring-2 ring-primary/40 dark:ring-primary/60 ring-offset-2 ring-offset-background dark:ring-offset-card opacity-0 group-focus-within:opacity-100 transition-all duration-[var(--transition-fast)] ease-out rounded-[var(--radius-surface)] pointer-events-none" />
    </div>
  )
}

export type DataListItemHeaderProps = {
  className?: string
}

export const DataListItemHeader: FC<PropsWithChildren<DataListItemHeaderProps>> = ({
  children,
  className,
}) => <div className={cn('[margin-bottom:var(--density-spacing-sm)]', className)}>{children}</div>

export type DataListItemContentProps = {
  className?: string
}

export const DataListItemContent: FC<PropsWithChildren<DataListItemContentProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Enhanced content spacing and typography 2025
      'space-y-[var(--density-spacing-sm)] text-sm text-muted-foreground',
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      'md:group-hover:text-foreground/95 md:group-hover:scale-[1.01]',
      'group-active:text-foreground/85',
      className,
    )}
  >
    {children}
  </div>
)

export type DataListItemActionsProps = {
  className?: string
}

export const DataListItemActions: FC<PropsWithChildren<DataListItemActionsProps>> = ({
  children,
  className,
}) => {
  const handleActionClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      className={cn(
        // Enhanced actions area with modern styling
        'relative z-30 mt-[var(--density-spacing-md)] pt-[var(--density-spacing-sm)]',
        'border-t border-[hsl(var(--border)/0.3)] dark:border-[hsl(var(--border)/0.2)] pointer-events-auto',
        'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'md:group-hover:border-[hsl(var(--border)/0.5)] dark:md:group-hover:border-[hsl(var(--border)/0.4)] md:group-hover:pt-[calc(var(--density-spacing-sm)*1.1)]',
        className,
      )}
      onClick={handleActionClick}
    >
      {children}
    </div>
  )
}

export const DataListItem = Object.assign(DataListItemComponent, {
  Header: DataListItemHeader,
  Content: DataListItemContent,
  Actions: DataListItemActions,
})
