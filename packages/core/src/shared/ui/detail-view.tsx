'use client'

import type { LucideIcon } from 'lucide-react'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { memo } from 'react'
import { cn } from '../utils'

export type DetailViewProps = {
  variant?: 'cards' | 'sections' | 'sidebar'
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
  gridCols?: 1 | 2 | 3 | 4
  cardsBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
  testId?: string
}

const getSpacingClasses = (spacing: 'sm' | 'md' | 'lg') => {
  const spacingMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }
  return spacingMap[spacing]
}

const DetailViewComponent: FC<PropsWithChildren<DetailViewProps>> = ({
  children,
  variant = 'cards',
  className,
  spacing = 'md',
  gridCols = 2,
  cardsBreakpoint = 'md',
  testId = 'detail-view',
}) => {
  const cardsBreakpointClassMap: Record<'md' | 'lg' | 'xl' | '2xl', string> = {
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-2',
    xl: 'xl:grid-cols-2',
    '2xl': '2xl:grid-cols-2',
  }

  const singleColumnBreakpointMap: Record<'md' | 'lg' | 'xl' | '2xl', string> = {
    md: 'md:grid-cols-1',
    lg: 'lg:grid-cols-1',
    xl: 'xl:grid-cols-1',
    '2xl': '2xl:grid-cols-1',
  }

  const selectedCardsBreakpointClass = cardsBreakpointClassMap[cardsBreakpoint]

  const baseClasses = cn(
    'w-full min-w-0',
    variant === 'cards' && [
      // ✅ Grid EXACT identique à ProductCardsGrid de l'original
      'grid grid-cols-1 gap-5 lg:gap-7 xl:gap-8 [&>*]:h-full',
      selectedCardsBreakpointClass,
      // Surcharge si gridCols spécifié
      gridCols === 1 && singleColumnBreakpointMap[cardsBreakpoint],
      gridCols === 3 && 'xl:grid-cols-3',
      gridCols === 4 && '2xl:grid-cols-4',
    ],
    variant === 'sections' && [
      'space-y-6 md:space-y-8', // Espacement identique à l'original
    ],
    variant === 'sidebar' && ['grid grid-cols-1 lg:grid-cols-4', getSpacingClasses(spacing)],
    className,
  )

  return (
    <div className={baseClasses} data-testid={testId}>
      {children}
    </div>
  )
}

export type DetailSectionProps = {
  title: ReactNode
  icon?: LucideIcon
  span?: 1 | 2 | 3 | 4
  collapsible?: boolean
  defaultOpen?: boolean
  loading?: boolean
  className?: string
  testId?: string
  status?: 'todo' | 'in_progress' | 'complete'
  statusText?: string
}

const DetailSectionComponent: FC<PropsWithChildren<DetailSectionProps>> = memo(
  ({
    children,
    title,
    icon: Icon,
    span,
    loading = false,
    className,
    testId = 'detail-section',
    status,
    statusText,
  }) => {
    const spanClasses = span
      ? {
          1: 'lg:col-span-1',
          2: 'lg:col-span-2',
          3: 'lg:col-span-3',
          4: 'lg:col-span-4',
        }[span]
      : ''

    return (
      <div
        data-testid={testId}
        className={cn(
          // Card base styling - migrated from card-base utility
          'text-card-foreground rounded-2xl transition-all duration-300',
          'border border-[var(--color-surface-line)]',
          'bg-[var(--color-surface-2)]',
          'shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--color-line)_45%,transparent)]',

          // Hover states
          'hover:-translate-y-px',
          'hover:border-[color-mix(in_oklch,var(--color-surface-line)_80%,transparent)]',
          'hover:bg-[color-mix(in_oklch,var(--color-surface-2)_92%,var(--color-surface-1)_8%)]',
          'hover:shadow-[0_16px_32px_-18px_color-mix(in_oklch,var(--color-line)_45%,transparent)]',

          // Dark mode
          'dark:bg-[var(--color-surface-2)]',
          'dark:border-[color-mix(in_oklch,var(--color-surface-line)_70%,transparent)]',
          'dark:shadow-[0_18px_40px_-22px_color-mix(in_oklch,var(--color-line)_60%,transparent)]',
          'dark:hover:shadow-[0_24px_52px_-26px_color-mix(in_oklch,var(--color-line)_65%,transparent)]',

          // Z-index pour que les dropdowns puissent passer au-dessus des autres cartes
          'relative z-0 min-w-0 overflow-hidden focus-within:z-10',
          'isolate',
          spanClasses,
          className,
        )}
      >
        {/* Header EXACT identique à CardHeader */}
        <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-4 sm:p-6 lg:p-8">
          <h3 className="text-foreground flex items-center gap-2 text-base leading-tight font-semibold tracking-tight sm:gap-3 sm:text-lg">
            {Icon && (
              <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-accent/20 p-1.5 sm:p-2">
                <Icon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            )}
            {title}
            <div className="ml-auto flex items-center gap-2">
              {status && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    status === 'complete' &&
                      'bg-success/15 text-success dark:bg-success/20 dark:text-success',
                    status === 'in_progress' &&
                      'bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning-foreground',
                    status === 'todo' &&
                      'bg-muted text-muted-foreground dark:bg-muted/40 dark:text-muted-foreground',
                  )}
                >
                  {statusText}
                </span>
              )}
              {loading && (
                <div className="border-primary/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2" />
              )}
            </div>
          </h3>
        </div>

        {/* Content EXACT identique à CardContent */}
        <div className="space-y-3 px-3 pt-3 pb-4 sm:space-y-4 sm:px-5 sm:pt-4 sm:pb-6 xl:px-7 xl:pt-5 xl:pb-7">
          {children}
        </div>
      </div>
    )
  },
)

DetailSectionComponent.displayName = 'DetailSectionComponent'

export type DetailFieldProps = {
  label: string
  description?: string
  error?: string
  required?: boolean
  loading?: boolean
  className?: string
  testId?: string
}

const DetailFieldComponent: FC<PropsWithChildren<DetailFieldProps>> = memo(
  ({
    children,
    label,
    description,
    error,
    required = false,
    loading = false,
    className,
    testId = 'detail-field',
  }) => {
    return (
      <div className={cn('space-y-1.5 sm:space-y-2', className)} data-testid={testId}>
        <div className="flex items-center gap-2">
          <label className="text-foreground text-xs font-medium sm:text-sm">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {loading && (
            <div className="border-primary/30 border-t-primary h-3 w-3 animate-spin rounded-full border" />
          )}
        </div>

        {description && (
          <p className="text-muted-foreground text-[10px] sm:text-xs">{description}</p>
        )}

        <div className="relative">{children}</div>

        {error && (
          <p className="text-destructive flex items-center gap-1 text-[10px] sm:text-xs">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    )
  },
)

DetailFieldComponent.displayName = 'DetailFieldComponent'

export type DetailFieldGroupProps = {
  layout?: 'row' | 'column' | 'grid-2' | 'grid-3'
  label?: string
  description?: string
  className?: string
  testId?: string
}

const DetailFieldGroupComponent: FC<PropsWithChildren<DetailFieldGroupProps>> = memo(
  ({
    children,
    layout = 'column',
    label,
    description,
    className,
    testId = 'detail-field-group',
  }) => {
    const layoutClasses = {
      row: 'flex flex-col sm:flex-row gap-4',
      column: 'space-y-4',
      'grid-2':
        'grid grid-cols-1 min-w-0 gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]',
      'grid-3': 'grid grid-cols-1 min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3',
    }

    return (
      <div className={cn('space-y-3 sm:space-y-4', className)} data-testid={testId}>
        {(label || description) && (
          <div className="space-y-1">
            {label && <h4 className="text-foreground text-xs font-medium sm:text-sm">{label}</h4>}
            {description && (
              <p className="text-muted-foreground text-[10px] sm:text-xs">{description}</p>
            )}
          </div>
        )}

        <div className={layoutClasses[layout]}>{children}</div>
      </div>
    )
  },
)

DetailFieldGroupComponent.displayName = 'DetailFieldGroupComponent'

export const DetailView = Object.assign(DetailViewComponent, {
  Section: DetailSectionComponent,
  Field: DetailFieldComponent,
  FieldGroup: DetailFieldGroupComponent,
})

export type { DetailViewProps as DetailViewComponentProps }
