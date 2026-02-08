'use client'

import { cn } from '@make-the-change/core/shared/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@make-the-change/core/ui'
import { Building, ChevronDown, ChevronUp, Info, Package, Star } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { type FC, useState } from 'react'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'
import { LocalizedLink as Link } from '@/components/localized-link'

import { SaveStatusIndicator } from './save-status-indicator'

type ProductData = {
  id: string
  name: string
  slug: string
  price_points: number
  short_description?: string
  description?: string
  stock_quantity: number
  is_active: boolean
  featured: boolean
  fulfillment_method: string
  min_tier: string
  category_id: string
  producer_id: string
  images?: string[]
  producer?: { id?: string; name?: string } | null
}

type ProductCompactHeaderProps = {
  productData: ProductData
  saveStatus?: SaveStatus | null
  onSaveAll?: () => void
  onStatusChange?: (newStatus: 'active' | 'inactive') => void
}

export const ProductCompactHeader: FC<ProductCompactHeaderProps> = ({
  productData,
  saveStatus,
  onSaveAll,
  onStatusChange,
}) => {
  const t = useTranslations()
  const [showMobileDetails, setShowMobileDetails] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<'active' | 'inactive' | null>(null)

  const getProductStatus = (): 'active' | 'inactive' => {
    return productData.is_active ? 'active' : 'inactive'
  }

  const status = getProductStatus()

  const statusConfig = {
    active: {
      label: t('admin.products.status.active'),
      dotClass: 'bg-success',
      pillClass: 'bg-success/10 border-success/25 hover:bg-success/15',
    },
    inactive: {
      label: t('admin.products.status.inactive'),
      dotClass: 'bg-muted-foreground',
      pillClass: 'bg-muted/30 border-border/60 hover:bg-muted/40',
    },
  }

  const statusInfo = statusConfig[status]
  const getPartnerDisplayName = (): string => {
    if (productData.producer?.name) return productData.producer.name
    if (!productData.producer_id) return t('admin.products.partner.none')
    return `${productData.producer_id}`
  }
  const hasProducer = Boolean(productData.producer_id)
  const producerName = productData.producer?.name || getPartnerDisplayName()

  const handleStatusToggle = () => {
    if (!onStatusChange) return
    const newStatus = productData.is_active ? 'inactive' : 'active'
    setPendingStatusChange(newStatus)
    setShowConfirmModal(true)
  }

  const confirmStatusChange = async () => {
    if (!onStatusChange || !pendingStatusChange) return
    setShowConfirmModal(false)
    setIsChangingStatus(true)
    try {
      await onStatusChange(pendingStatusChange)
    } finally {
      setIsChangingStatus(false)
      setPendingStatusChange(null)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmModal(false)
    setPendingStatusChange(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
          {productData.images && productData.images.length > 0 ? (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
              <Image
                fill
                alt={productData.name}
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
                src={productData.images[0] || ''}
              />
            </div>
          ) : (
            <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2">
              {productData.name}
            </h1>

            <div className="flex md:hidden items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border',
                  'transition-colors transition-shadow',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  statusInfo.pillClass,
                  onStatusChange &&
                    !isChangingStatus &&
                    'hover:shadow-sm motion-reduce:hover:shadow-none cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait',
                )}
                title={
                  onStatusChange
                    ? t('admin.products.status.toggle_tooltip', {
                        action: productData.is_active
                          ? t('admin.products.status.deactivate')
                          : t('admin.products.status.activate'),
                      })
                    : undefined
                }
                onClick={handleStatusToggle}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    'transition-transform motion-reduce:transition-none',
                    statusInfo.dotClass,
                    isChangingStatus && 'animate-pulse',
                  )}
                />
                {isChangingStatus ? t('admin.products.status.changing') : statusInfo.label}
              </button>

              {productData.featured && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium">
                <Star className="h-3 w-3" />
                <span>{t('admin.products.featured.short')}</span>
              </div>
            )}
            </div>

            <div className="hidden md:flex items-center gap-4 flex-wrap">
              <button
                type="button"
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  'transition-colors transition-shadow',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  statusInfo.pillClass,
                  onStatusChange &&
                    !isChangingStatus &&
                    'hover:shadow-sm motion-reduce:hover:shadow-none cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait',
                )}
                title={
                  onStatusChange
                    ? t('admin.products.status.toggle_tooltip', {
                        action: productData.is_active
                          ? t('admin.products.status.deactivate')
                          : t('admin.products.status.activate'),
                      })
                    : undefined
                }
                onClick={handleStatusToggle}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    'transition-transform motion-reduce:transition-none',
                    statusInfo.dotClass,
                    isChangingStatus && 'animate-pulse',
                  )}
                />
                {isChangingStatus ? t('admin.products.status.changing') : statusInfo.label}
              </button>

              {productData.featured && (
                <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3" />
                  {t('admin.products.featured.full')}
                </div>
              )}

              {hasProducer ? (
                <Link
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                    'bg-info/10 border-info/20 text-info hover:bg-info/15',
                    'transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  )}
                  href={`/admin/partners/${productData.producer_id}`}
                  title={t('admin.products.partner.view_tooltip', {
                    name: producerName,
                  })}
                >
                  <Building className="h-3 w-3" />
                  <span>{getPartnerDisplayName()}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border/60 rounded-full text-xs font-medium text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>{getPartnerDisplayName()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
          <button
            type="button"
            className="flex md:hidden items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md border border-[hsl(var(--border)/0.4)] hover:border-[hsl(var(--border)/0.6)]"
            aria-label={
              showMobileDetails
                ? t('admin.products.details.hide')
                : t('admin.products.details.show')
            }
            onClick={() => setShowMobileDetails(!showMobileDetails)}
          >
            <Info className="h-3 w-3" />
            {showMobileDetails ? (
              <ChevronUp className="h-3 w-3 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-3 w-3 transition-transform duration-200" />
            )}
          </button>

          <SaveStatusIndicator saveStatus={saveStatus} onSaveAll={onSaveAll} />
        </div>
      </div>

      {showMobileDetails && (
        <div className="flex md:hidden mt-3 pt-3 border-t border-[hsl(var(--border)/0.3)] animate-in slide-in-from-top-2 duration-200 ease-out">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {hasProducer ? (
              <Link
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                  'bg-info/10 border-info/20 text-info',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
                href={`/admin/partners/${productData.producer_id}`}
                title={t('admin.products.partner.view_tooltip', {
                  name: producerName,
                })}
              >
                <Building className="h-3 w-3" />
                <span>{getPartnerDisplayName()}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-muted/30 border border-border/60 rounded-full text-xs font-medium text-muted-foreground">
                <Building className="h-3 w-3" />
                <span>{getPartnerDisplayName()}</span>
              </div>
            )}
            <div className="px-2 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
              #{productData.id}
            </div>
          </div>
        </div>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md" size="sm">
          <DialogHeader>
            <DialogTitle>
              {t('admin.products.status.modal.title', {
                action:
                  pendingStatusChange === 'active'
                    ? t('admin.products.status.activate')
                    : t('admin.products.status.deactivate'),
              })}
            </DialogTitle>
            <DialogDescription>
              {pendingStatusChange === 'active'
                ? t('admin.products.status.modal.description.activate')
                : t('admin.products.status.modal.description.deactivate')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 border border-border/60 rounded-xl">
              {productData.images && productData.images.length > 0 ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border/60 bg-background">
                  <Image
                    fill
                    alt={productData.name}
                    className="object-cover"
                    sizes="64px"
                    src={productData.images[0] || ''}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-border/60">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate text-foreground">
                  {productData.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">ID: {productData.id}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cancelStatusChange}>
              {t('admin.products.status.modal.cancel')}
            </Button>
            <Button
              variant={pendingStatusChange === 'active' ? 'default' : 'destructive'}
              onClick={confirmStatusChange}
            >
              {pendingStatusChange === 'active'
                ? t('admin.products.status.activate')
                : t('admin.products.status.deactivate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
