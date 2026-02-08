'use client';

import { Package, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FC, ReactNode } from 'react';

export type BreadcrumbItem = {
  href?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type AdminDetailHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  statusIndicator?: ReactNode;
  productImage?: string;
  className?: string;
  testId?: string;
};

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
    <div
      className={cn('mx-auto max-w-7xl px-4 md:px-8', className)}
      data-testid={testId}
    >
      {/* Breadcrumbs - Responsive: Back button on mobile, full path on desktop */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="text-muted-foreground pt-3 pb-1 text-sm"
        >
          {/* Mobile: Back button + current page only */}
          <div className="flex items-center gap-2 md:hidden">
            {(() => {
              if (breadcrumbs.length < 2) return null;
              const prevBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
              if (!prevBreadcrumb?.href) return null;

              return (
                <Link
                  href={prevBreadcrumb.href}
                  className="hover:bg-muted -ml-2 flex items-center gap-1 rounded-lg p-2 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-xs font-medium">Retour</span>
                </Link>
              );
            })()}
          </div>

          {/* Desktop: Full breadcrumb path */}
          <div className="hidden items-center gap-2 md:flex">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'flex items-center gap-1',
                      index === breadcrumbs.length - 1
                        ? 'text-foreground font-medium'
                        : ''
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="max-w-[300px] truncate lg:max-w-none">{item.label}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}

      {/* Main Header - Responsive: Stack on mobile, horizontal on desktop */}
      <div className="flex flex-col gap-4 py-3 pb-4 md:flex-row md:items-start md:justify-between">
        {/* Left section: Image + Title + Subtitle */}
        <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
          {/* Image du produit */}
          {productImage ? (
            <div className="border-primary/20 from-primary/10 relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border bg-gradient-to-br to-orange-500/10 md:h-16 md:w-16">
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
              <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:p-3">
                <Package className="text-primary h-5 w-5 md:h-6 md:w-6" />
              </div>
            )
          )}

          <div className="min-w-0 flex-1">
            {title && (
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-foreground truncate text-xl font-bold md:text-2xl">
                  {title}
                </h1>
                {statusIndicator && (
                  <div className="flex-shrink-0">{statusIndicator}</div>
                )}
              </div>
            )}

            {subtitle && (
              <p className="text-muted-foreground truncate text-sm leading-relaxed md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right section: Actions - Full width on mobile, auto on desktop */}
        {actions && (
          <div className="flex w-full flex-shrink-0 md:ml-4 md:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export type SaveStatusType =
  | 'saving'
  | 'saved'
  | 'error'
  | 'modified'
  | 'pristine';

export type SaveStatus = {
  type: SaveStatusType;
  message: string;
  count?: number;
  fields?: string[];
  timestamp?: Date;
  retryable?: boolean;
};

export type AdminDetailActionsProps = {
  saveStatus?: SaveStatus;
  onSaveAll?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  primaryActions?: ReactNode;
  secondaryActions?: ReactNode;
  className?: string;
  testId?: string;
};

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
      saving: 'text-blue-600 dark:text-blue-400',
      saved: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      modified: 'text-yellow-600 dark:text-yellow-400',
      pristine: 'text-muted-foreground',
    };
    return colors[type];
  };

  const getStatusIcon = (type: SaveStatusType) => {
    const icons = {
      saving: '⏳',
      saved: '✅',
      error: '❌',
      modified: '📝',
      pristine: '💾',
    };
    return icons[type];
  };

  // Get responsive message (short on mobile, full on desktop)
  const getResponsiveMessage = (message: string, type: SaveStatusType) => {
    const shortMessages: Record<SaveStatusType, string> = {
      saving: 'En cours...',
      saved: 'Sauvegardé',
      error: 'Erreur',
      modified: 'Modifié',
      pristine: 'OK',
    };

    return {
      full: message,
      short: shortMessages[type] || message.split(' ')[0], // First word as fallback
    };
  };

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      data-testid={testId}
    >
      {/* Status Indicator */}
      {saveStatus && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            saveStatus.type === 'saving' &&
              'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
            saveStatus.type === 'saved' &&
              'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
            saveStatus.type === 'error' &&
              'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
            saveStatus.type === 'modified' &&
              'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
            saveStatus.type === 'pristine' && 'bg-muted/50 border-border'
          )}
        >
          <span className={getStatusColor(saveStatus.type)}>
            {getStatusIcon(saveStatus.type)}
          </span>
          {/* Short message on mobile, full on desktop */}
          <span className={cn(getStatusColor(saveStatus.type), 'hidden sm:inline')}>
            {saveStatus.message}
          </span>
          <span className={cn(getStatusColor(saveStatus.type), 'sm:hidden')}>
            {getResponsiveMessage(saveStatus.message, saveStatus.type).short}
          </span>
          {saveStatus.type === 'error' && saveStatus.retryable && onSaveAll && (
            <button
              className="ml-1 text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              onClick={onSaveAll}
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      {/* Secondary Actions */}
      {secondaryActions}

      {/* Primary Actions */}
      {primaryActions}

      {/* Cancel Button */}
      {onCancel && (
        <button
          className="border-border hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          onClick={onCancel}
        >
          Annuler
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          onClick={onDelete}
        >
          Supprimer
        </button>
      )}
    </div>
  );
};
