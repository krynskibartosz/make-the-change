'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { CheckCircle2, Loader2, Package, PencilLine, Save, XCircle } from 'lucide-react'
import Image from 'next/image'
import type { FC, ReactNode } from 'react'
import { LocalizedLink } from '@/components/localized-link'

export type BreadcrumbItem = {
  href?: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

export type AdminDetailHeaderProps = {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  subtitle?: string
  actions?: ReactNode
  statusIndicator?: ReactNode
  productImage?: string
  className?: string
  testId?: string
}

export const AdminDetailHeader: FC<AdminDetailHeaderProps> = ({
  breadcrumbs = [],
  title,
  subtitle,
  actions,
  statusIndicator,
  productImage,
  className,
  testId = 'admin-detail-header',
}) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 md:px-8', className)} data-testid={testId}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-muted-foreground pt-3 pb-1"
        >
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              )}
              {item.href ? (
                <LocalizedLink
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  href={item.href}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </LocalizedLink>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1',
                    index === breadcrumbs.length - 1
                      ? 'text-foreground font-medium truncate max-w-[200px] md:max-w-none'
                      : '',
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Main Header */}
      <div className="flex items-start justify-between py-3 pb-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          {/* Image du produit */}
          {productImage ? (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-orange-500/10">
              <Image
                fill
                alt={title || 'Product image'}
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
                src={productImage}
              />
            </div>
          ) : (
            title && (
              <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
                <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            )
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{title}</h1>
                {statusIndicator && <div className="flex-shrink-0">{statusIndicator}</div>}
              </div>
            )}

            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
      </div>
    </div>
  )
}

export type SaveStatusType = 'saving' | 'saved' | 'error' | 'modified' | 'pristine'

export type SaveStatus = {
  type: SaveStatusType
  message: string
  count?: number
  fields?: string[]
  timestamp?: Date
  retryable?: boolean
}

export type AdminDetailActionsProps = {
  saveStatus?: SaveStatus
  onSaveAll?: () => void
  onCancel?: () => void
  onDelete?: () => void
  primaryActions?: ReactNode
  secondaryActions?: ReactNode
  className?: string
  testId?: string
}

export const AdminDetailActions: FC<AdminDetailActionsProps> = ({
  saveStatus,
  onSaveAll,
  onCancel,
  onDelete,
  primaryActions,
  secondaryActions,
  className,
  testId = 'admin-detail-actions',
}) => {
  const getStatusColor = (type: SaveStatusType) => {
    const colors = {
      saving: 'text-info',
      saved: 'text-success',
      error: 'text-destructive',
      modified: 'text-warning',
      pristine: 'text-muted-foreground',
    }
    return colors[type]
  }

  const getStatusIcon = (type: SaveStatusType) => {
    const icons = {
      saving: <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />,
      saved: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
      error: <XCircle className="h-3.5 w-3.5" aria-hidden="true" />,
      modified: <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />,
      pristine: <Save className="h-3.5 w-3.5" aria-hidden="true" />,
    } as const
    return icons[type]
  }

  return (
    <div className={cn('flex items-center gap-3', className)} data-testid={testId}>
      {/* Status Indicator */}
      {saveStatus && (
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
            saveStatus.type === 'saving' && 'bg-info/10 border-info/20',
            saveStatus.type === 'saved' && 'bg-success/10 border-success/20',
            saveStatus.type === 'error' && 'bg-destructive/10 border-destructive/20',
            saveStatus.type === 'modified' && 'bg-warning/10 border-warning/20',
            saveStatus.type === 'pristine' && 'bg-muted/50 border-[hsl(var(--border))]',
          )}
        >
          <span className={getStatusColor(saveStatus.type)}>{getStatusIcon(saveStatus.type)}</span>
          <span className={getStatusColor(saveStatus.type)}>{saveStatus.message}</span>
          {saveStatus.type === 'error' && saveStatus.retryable && onSaveAll && (
            <Button className="ml-1 h-6 px-2" size="sm" variant="link" onClick={onSaveAll}>
              Réessayer
            </Button>
          )}
        </div>
      )}

      {/* Secondary Actions */}
      {secondaryActions}

      {/* Primary Actions */}
      {primaryActions}

      {/* Cancel Button */}
      {onCancel && (
        <Button size="sm" type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <Button size="sm" type="button" variant="destructive" onClick={onDelete}>
          Supprimer
        </Button>
      )}
    </div>
  )
}
