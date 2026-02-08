'use client'

import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { FC, KeyboardEvent, MouseEvent, PropsWithChildren, ReactNode } from 'react'
import { useCallback } from 'react'
import { cn } from './utils'

/**
 * Props for the DataList component.
 * @template T - The type of items in the list.
 */
export type DataListProps<T> = {
  /** The display variant of the list. */
  variant?: 'grid' | 'list'
  /** The array of items to display. */
  items: T[]
  /** Function to render each item. */
  renderItem: (item: T, index?: number) => ReactNode
  /** Function to render a skeleton item during loading. */
  renderSkeleton: () => ReactNode
  /** Configuration for the empty state. */
  emptyState: {
    icon?: LucideIcon
    title: string
    description?: string
    action?: ReactNode
  }
  /** Whether the list is currently loading. */
  isLoading: boolean
  /** Function to get a unique key for each item. */
  getItemKey?: (item: T, index: number) => string | number
  /** Additional CSS classes for the container. */
  className?: string
  /** Number of columns in grid mode (responsive). */
  gridCols?: 1 | 2 | 3 | 4
  /** Spacing between items. */
  spacing?: 'sm' | 'md' | 'lg'
  /** Test ID for testing purposes. */
  testId?: string
}

const getGridClasses = (cols: number) => {
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  }
  return gridMap[cols as keyof typeof gridMap]
}

const getSpacingClasses = (spacing: 'sm' | 'md' | 'lg') => {
  const spacingMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }
  return spacingMap[spacing]
}

/**
 * A flexible component for displaying lists or grids of data with loading, empty, and success states.
 */
const DataListComponent = <T,>({
  variant = 'grid',
  items,
  renderItem,
  renderSkeleton,
  emptyState,
  isLoading,
  getItemKey,
  className,
  gridCols = 3,
  spacing = 'md',
  testId = 'data-list',
}: DataListProps<T>) => {
  const getKey = (item: T, index: number): string | number => {
    if (getItemKey) {
      return getItemKey(item, index)
    }
    // Default key generation strategy
    if (item && typeof item === 'object') {
      const obj = item as any
      if (obj.dbid !== undefined) return obj.dbid
      if (obj.id !== undefined) return obj.id
      if (obj.uuid !== undefined) return obj.uuid
    }
    return index
  }

  if (isLoading) {
    const skeletonItems = variant === 'grid' ? gridCols * 2 : 6

    return (
      <div className={cn('space-y-6', className)} data-testid={testId}>
        {variant === 'grid' ? (
          <div
            className={cn(
              'grid',
              getGridClasses(gridCols),
              getSpacingClasses(spacing),
              'items-stretch auto-rows-fr',
            )}
          >
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index} className="h-full">
                {renderSkeleton()}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index} className="py-1">
                {renderSkeleton()}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (items.length === 0 && emptyState) {
    const EmptyIcon = emptyState.icon
    return (
      <div className={cn('space-y-6', className)} data-testid={testId}>
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 py-12 text-center duration-700 ease-out">
          {EmptyIcon && (
            <div className="mb-4 flex items-center justify-center">
              <div className="bg-muted/30 dark:bg-muted/20 animate-in fade-in-0 scale-in-95 rounded-2xl p-4 delay-150 duration-500">
                <EmptyIcon className="text-muted-foreground h-8 w-8" />
              </div>
            </div>
          )}
          <h3 className="text-foreground animate-in fade-in-0 slide-in-from-bottom-2 mb-2 text-lg font-semibold delay-300 duration-500">
            {emptyState.title}
          </h3>
          {emptyState.description && (
            <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-1 mx-auto mb-6 max-w-md delay-500 duration-500">
              {emptyState.description}
            </p>
          )}
          <div className="animate-in fade-in-0 slide-in-from-bottom-1 delay-700 duration-500">
            {emptyState.action}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      {/* Grid variant - Always mounted, toggle with CSS */}
      <div
        data-testid={`${testId}-grid`}
        className={cn(
          'grid',
          getGridClasses(gridCols),
          getSpacingClasses(spacing),
          'items-stretch auto-rows-fr',
          variant !== 'grid' && 'hidden',
        )}
        aria-hidden={variant !== 'grid'}
      >
        {items.map((item, index) => (
          <div key={getKey(item, index)} className="h-full">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* List variant - Always mounted, toggle with CSS */}
      <div
        data-testid={`${testId}-list`}
        className={cn('space-y-6 lg:space-y-7', variant !== 'list' && 'hidden')}
        aria-hidden={variant !== 'list'}
      >
        {items.map((item, index) => (
          <div key={getKey(item, index)} className="py-1">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Props for DataListList component.
 */
export type DataListListProps<T> = Omit<DataListProps<T>, 'variant' | 'renderItem'> & {
  itemProps?: (item: T, index: number) => DataListItemProps | undefined
  renderItem: (item: T, index: number) => ReactNode
}

const DataListList = <T,>({ itemProps, renderItem, ...rest }: DataListListProps<T>) => (
  <DataListComponent
    {...rest}
    variant="list"
    renderItem={(item, index = 0) => (
      <DataListItem {...itemProps?.(item, index)}>{renderItem(item, index)}</DataListItem>
    )}
  />
)

/**
 * Props for DataCard component.
 */
export type DataCardProps = {
  className?: string
  href?: string
  onClick?: () => void
  testId?: string
  image?: string
  imageAlt?: string
}

const DataCardComponent: FC<PropsWithChildren<DataCardProps>> = ({
  children,
  className,
  href,
  onClick,
  testId,
  image,
  imageAlt,
}) => {
  const router = useRouter()

  const baseClasses = cn(
    // Base card styling - Vibrant Organic
    'group text-card-foreground cursor-pointer relative flex h-full flex-col overflow-hidden',
    'rounded-3xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300',

    // Container query support
    '@container/card',

    // Transitions
    'will-change-transform',
  )

  const handleCardClick = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('a[href]') || target.closest('button')) {
        return
      }

      if (href) {
        router.push(href)
      }

      onClick?.()
    },
    [href, router, onClick],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleCardClick(event)
      }
    },
    [handleCardClick],
  )

  return (
    <div
      data-testid={testId}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      className={cn(
        baseClasses,
        className,

        (href || onClick) && 'cursor-pointer',
      )}
      onClick={href || onClick ? handleCardClick : undefined}
      onKeyDown={href || onClick ? handleKeyDown : undefined}
    >
      <>
        {/* Background Image */}
        {image && imageAlt && (
          <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden [border-radius:var(--radius-surface)_var(--radius-surface)_0_0] opacity-10 transition-opacity duration-300 md:group-hover:opacity-20">
            <Image
              fill
              alt={imageAlt}
              className="scale-110 object-cover"
              src={image}
              unoptimized={image.includes('unsplash') || image.includes('supabase')}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="relative flex h-full flex-col [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10">
          {children}
        </div>
      </>
    </div>
  )
}

type DataCardHeaderProps = {
  className?: string
}

const DataCardHeader: FC<PropsWithChildren<DataCardHeaderProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Container query responsive layout
      'mb-6 flex flex-col items-start justify-between',
      'gap-3',
      '@container/card:@[32rem]:flex-row',
      className,
    )}
  >
    {children}
  </div>
)

type DataCardTitleProps = {
  icon?: LucideIcon
  image?: ReactNode
  className?: string
}

const DataCardTitle: FC<PropsWithChildren<DataCardTitleProps>> = ({
  children,
  icon: Icon,
  image,
  className,
}) => {
  const shouldShowIcon = Icon && !image
  const shouldShowImage = !!image

  return (
    <div
      className={cn(
        // Container query responsive layout
        'relative w-full flex flex-wrap items-center min-w-0',
        'gap-3',
        '@container/card:@[38rem]:gap-4',
      )}
    >
      {shouldShowImage && <div className="flex-shrink-0">{image}</div>}
      {shouldShowIcon && (
        <div className="from-primary/10 dark:from-primary/15 border-primary/20 dark:border-primary/30 flex h-21 w-21 flex-shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br to-accent/10 dark:to-accent/15">
          <Icon className="text-muted-foreground" size={32} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div
          className={cn('text-foreground text-lg font-semibold tracking-tight', className)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

type DataCardContentProps = {
  className?: string
}

const DataCardContent: FC<PropsWithChildren<DataCardContentProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Container query responsive layout
      'mb-4 flex flex-1 flex-col flex-wrap',
      'gap-3',
      '@container/card:@[42rem]:flex-row',
      '@container/card:@[42rem]:gap-4',
      className,
    )}
  >
    {children}
  </div>
)

type DataCardFooterProps = {
  className?: string
}

const DataCardFooter: FC<PropsWithChildren<DataCardFooterProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'text-primary dark:text-primary group mt-auto flex items-center justify-between border-t px-0 pt-4 pb-3 text-sm font-medium',
      'border-white/10 dark:border-slate-800',
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
  <div className="text-muted-foreground flex items-center gap-3 text-sm">
    <Icon className="h-4 w-4" />
    <span className="[&>a]:md:group-hover:text-primary [&>a]:transition-all [&>a]:duration-200 [&>a]:hover:!font-medium [&>a]:hover:!text-primary [&>a]:md:group-hover:underline">
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

export const DataList = Object.assign(DataListComponent, {
  List: DataListList,
})

/**
 * Props for DataListItem component.
 */
export type DataListItemProps = {
  href?: string
  onClick?: () => void
  className?: string
  testId?: string
}

const DataListItemComponent: FC<PropsWithChildren<DataListItemProps>> = ({
  children,
  href,
  onClick,
  className,
  testId,
}) => {
  const router = useRouter()

  const baseClasses = cn(
    // Base layout & behavior
    'group relative cursor-pointer text-foreground',
    // Replaced bento-card with explicit styles
    'rounded-3xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200',

    // Unified transition system
    'will-change-transform',

    // Hover states
    'hover:scale-[1.01]', // Keep scale effect for list items

    // Active states
    'active:scale-[0.99]',

    // Enhanced focus with design system - only for keyboard navigation
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',

    className,
  )

  const handleCardClick = (event: MouseEvent | KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (target.closest('a[href]') || target.closest('button')) {
      // Remove focus from the container when clicking on interactive elements
      ;(event.currentTarget as HTMLElement)?.blur()
      return
    }

    if (href) {
      router.push(href)
    }
    onClick?.()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick(event)
    }
  }

  return (
    <div
      className={baseClasses}
      data-testid={testId}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* Content with higher z-index */}
      <div className="pointer-events-none relative z-20 flex items-center justify-between">
        <div className="min-w-0 flex-1">{children}</div>

        {/* Modern chevron indicator 2025 */}
        {href && (
          <div className="ml-4 flex-shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-active:translate-x-0.5 group-active:scale-105 md:group-hover:translate-x-1.5 md:group-hover:scale-110">
            <div className="relative">
              {/* Animated background bubble */}
              <div className="from-primary/20 to-accent/15 absolute inset-0 scale-0 rounded-full bg-gradient-to-r opacity-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:group-hover:scale-150 md:group-hover:opacity-100" />

              {/* Enhanced chevron with micro-interaction */}
              <svg
                className="relative z-10 drop-shadow-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="text-primary opacity-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-active:opacity-80 md:group-hover:stroke-[3] md:group-hover:opacity-100"
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
    </div>
  )
}

type DataListItemHeaderProps = {
  className?: string
}

const DataListItemHeader: FC<PropsWithChildren<DataListItemHeaderProps>> = ({
  children,
  className,
}) => <div className={cn('mb-3', className)}>{children}</div>

type DataListItemContentProps = {
  className?: string
}

const DataListItemContent: FC<PropsWithChildren<DataListItemContentProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Enhanced content spacing and typography 2025
      'text-muted-foreground space-y-3 text-sm',
      'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
      'md:group-hover:text-foreground/95 md:group-hover:scale-[1.01]',
      'group-active:text-foreground/85',
      className,
    )}
  >
    {children}
  </div>
)

type DataListItemActionsProps = {
  className?: string
}

const DataListItemActions: FC<PropsWithChildren<DataListItemActionsProps>> = ({
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
        'relative z-30 mt-4 pt-3',
        'border-border/30 dark:border-border/20 pointer-events-auto border-t',
        'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'md:group-hover:border-border/50 dark:md:group-hover:border-border/40 md:group-hover:pt-[calc(12px*1.1)]',
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
