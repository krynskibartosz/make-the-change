'use client'

import { ArrowRight, Package } from 'lucide-react'
import Image from 'next/image'
import { type FC, type ReactNode, useState } from 'react'
import { cn } from '../utils'
import { DataCard } from './data-card'
import {
  DataListItem,
  DataListItemActions,
  DataListItemContent,
  DataListItemHeader,
} from './data-list-item'
import type {
  ProductCardBadge,
  ProductCardBadgeTone,
  ProductCardContext,
  ProductCardModel,
  ProductCardProps,
  ProductCardView,
} from './product-card.types'

const gridCardClasses: Record<ProductCardContext, string> = {
  admin: 'h-full rounded-2xl p-4 md:p-5',
  clientCatalog:
    'h-full rounded-3xl border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-5',
  clientHome:
    'h-full overflow-hidden rounded-3xl border-border bg-card p-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-4',
}

const titleClasses: Record<ProductCardContext, string> = {
  admin: 'text-lg font-semibold leading-tight tracking-tight text-foreground',
  clientCatalog: 'text-xl font-black tracking-tight text-foreground',
  clientHome:
    'text-base font-medium leading-tight text-foreground transition-colors group-hover:text-primary',
}

const subtitleClasses: Record<ProductCardContext, string> = {
  admin: 'mt-1 text-xs font-medium text-muted-foreground/80',
  clientCatalog: 'mt-1 text-xs font-medium text-muted-foreground/80',
  clientHome: 'mt-1 text-xs font-medium text-muted-foreground/80',
}

const descriptionClasses: Record<ProductCardContext, string> = {
  admin: 'line-clamp-2 text-xs leading-relaxed text-muted-foreground',
  clientCatalog: 'line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground',
  clientHome: 'line-clamp-1 text-sm text-muted-foreground',
}

const pointsClasses: Record<ProductCardContext, string> = {
  admin: 'text-base font-bold tracking-tight text-foreground tabular-nums',
  clientCatalog: 'text-2xl font-black tracking-tight text-primary tabular-nums',
  clientHome: 'text-base font-bold text-primary tabular-nums',
}

const footerClasses: Record<ProductCardContext, string> = {
  admin: 'mt-3 border-t border-border/70 pt-3 text-sm font-medium text-muted-foreground',
  clientCatalog:
    'mt-3 border-t border-border/70 pt-3 text-sm font-black uppercase tracking-wide text-primary',
  clientHome:
    'mt-2 border-t border-border/60 pt-2 text-xs font-semibold uppercase tracking-wide text-primary',
}

const badgeToneClasses: Record<ProductCardBadgeTone, string> = {
  primary: 'bg-primary/90 text-primary-foreground',
  danger: 'bg-destructive/90 text-destructive-foreground',
  neutral: 'bg-background/90 text-foreground backdrop-blur',
  success: 'bg-success/90 text-success-foreground',
  warning: 'bg-warning/90 text-warning-foreground',
}

const listContainerClasses: Record<ProductCardContext, string> = {
  admin: '',
  clientCatalog: '',
  clientHome: '',
}

const getMediaContainerClasses = (context: ProductCardContext, view: ProductCardView) => {
  if (view === 'list') {
    if (context === 'admin') {
      return 'relative h-16 w-16 overflow-hidden rounded-md border border-border/60 bg-muted/30 flex-shrink-0'
    }
    return 'relative h-10 w-10 overflow-hidden rounded-md border border-border/60 bg-muted/30 flex-shrink-0'
  }

  switch (context) {
    case 'admin':
      return 'relative mb-4 h-36 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30'
    case 'clientHome':
      return 'relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary/20'
    default:
      return 'relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted/40'
  }
}

const formatPoints = (value: number) => value.toLocaleString()

const formatEuro = (value: number) => `€${value.toFixed(2)}`

const buildLegacyBadges = (
  model: ProductCardModel,
  labels: {
    featuredLabel?: string
    outOfStockLabel?: string
    lowStockLabel?: string
  },
): ProductCardBadge[] => {
  const outOfStock =
    model.stockQuantity !== null && model.stockQuantity !== undefined && model.stockQuantity <= 0
  const lowStock =
    model.stockQuantity !== null &&
    model.stockQuantity !== undefined &&
    model.stockQuantity > 0 &&
    model.stockQuantity <= 5

  const badges: ProductCardBadge[] = []

  if (model.featured && labels.featuredLabel) {
    badges.push({
      id: 'legacy-featured',
      label: labels.featuredLabel,
      tone: 'primary',
    })
  }

  if (lowStock && labels.lowStockLabel) {
    badges.push({
      id: 'legacy-low-stock',
      label: labels.lowStockLabel,
      tone: 'danger',
    })
  }

  if (outOfStock && labels.outOfStockLabel) {
    badges.push({
      id: 'legacy-out-of-stock',
      label: labels.outOfStockLabel,
      tone: 'neutral',
    })
  }

  return badges
}

const resolveBadges = (
  model: ProductCardModel,
  labels: {
    featuredLabel?: string
    outOfStockLabel?: string
    lowStockLabel?: string
  },
): ProductCardBadge[] => {
  if (model.badges !== undefined) {
    return (model.badges ?? []).filter((badge) => badge.label.trim().length > 0)
  }

  return buildLegacyBadges(model, labels)
}

const ProductMedia: FC<{
  context: ProductCardContext
  view: ProductCardView
  model: ProductCardModel
  featuredLabel?: string
  outOfStockLabel?: string
  lowStockLabel?: string
  topRight?: ReactNode
  mediaOverlay?: ReactNode
}> = ({
  context,
  view,
  model,
  featuredLabel,
  outOfStockLabel,
  lowStockLabel,
  topRight,
  mediaOverlay,
}) => {
  const imageSrc = model.image?.src ?? undefined
  const imageAlt = model.image?.alt || model.title
  const hoverImageSrc = model.hoverImageSrc ?? undefined
  const blurDataURL = model.image?.blurDataURL ?? undefined
  const [mainImageFailed, setMainImageFailed] = useState(false)
  const [hoverImageFailed, setHoverImageFailed] = useState(false)
  const hasMainImage = !!imageSrc && !mainImageFailed
  const hasHoverImage = !!hoverImageSrc && !hoverImageFailed && hasMainImage
  const badges = resolveBadges(model, {
    featuredLabel,
    outOfStockLabel,
    lowStockLabel,
  })

  return (
    <div className={getMediaContainerClasses(context, view)}>
      {hasMainImage ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={!!model.imagePriority}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            className={cn(
              'object-cover transition-all duration-700 ease-in-out',
              hasHoverImage
                ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105'
                : '',
            )}
            unoptimized={imageSrc.includes('unsplash') || imageSrc.includes('supabase')}
            onError={() => setMainImageFailed(true)}
          />
          {hasHoverImage && (
            <Image
              src={hoverImageSrc!}
              alt={imageAlt}
              fill
              className="object-cover opacity-0 scale-100 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
              unoptimized={hoverImageSrc.includes('unsplash') || hoverImageSrc.includes('supabase')}
              onError={() => setHoverImageFailed(true)}
            />
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Package className="h-10 w-10 text-muted-foreground/25" />
        </div>
      )}

      {view === 'grid' && badges.length > 0 && (
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2 pointer-events-none">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold',
                badgeToneClasses[badge.tone || 'neutral'],
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {view === 'grid' && topRight && (
        <div className="absolute right-3 top-3 z-20 pointer-events-auto" data-card-action>
          {topRight}
        </div>
      )}
      {view === 'grid' && mediaOverlay && (
        <div
          className="absolute inset-0 z-20 pointer-events-none [&>*]:pointer-events-auto"
          data-card-action
        >
          {mediaOverlay}
        </div>
      )}
    </div>
  )
}

const ProductMeta: FC<{
  context: ProductCardContext
  model: ProductCardModel
  metaChips?: ReactNode
}> = ({ context, model, metaChips }) => {
  const hasDefaultMeta =
    !!model.categoryName ||
    !!model.producerName ||
    !!model.partnerSource ||
    !!(model.tags && model.tags.length > 0)

  if (!hasDefaultMeta && !metaChips) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2 pointer-events-auto">
      {model.categoryName && <span className="badge-subtle">{model.categoryName}</span>}
      {model.producerName && <span className="tag-subtle">{model.producerName}</span>}
      {model.partnerSource && <span className="tag-subtle">{model.partnerSource}</span>}
      {(model.tags || []).slice(0, context === 'admin' ? 4 : 2).map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-md border border-muted/60 bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
        >
          {tag}
        </span>
      ))}
      {metaChips && (
        <div className="contents" data-card-action>
          {metaChips}
        </div>
      )}
    </div>
  )
}

const ProductMetrics: FC<{
  context: ProductCardContext
  model: ProductCardModel
  pointsLabel: string
  stockLabel?: string
}> = ({ context, model, pointsLabel, stockLabel }) => {
  const showPoints = model.pricePoints !== null && model.pricePoints !== undefined
  const showEuro = model.priceEuro !== null && model.priceEuro !== undefined && model.priceEuro > 0

  if (!showPoints && !showEuro && context !== 'admin') {
    return null
  }

  if (context === 'admin') {
    return (
      <div className="flex items-center gap-4 text-sm">
        {showPoints && (
          <div className="flex items-baseline gap-1.5">
            <span className={pointsClasses[context]}>{formatPoints(model.pricePoints || 0)}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
              {pointsLabel}
            </span>
          </div>
        )}
        {model.stockQuantity !== null && model.stockQuantity !== undefined && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {model.stockQuantity}
            </span>
            {stockLabel && (
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                {stockLabel}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end shrink-0">
      {showPoints && (
        <span className={pointsClasses[context]}>
          {formatPoints(model.pricePoints || 0)} {pointsLabel}
        </span>
      )}
      {showEuro && (
        <span className="text-sm font-medium text-muted-foreground">
          {formatEuro(model.priceEuro || 0)}
        </span>
      )}
    </div>
  )
}

const ProductCardGrid: FC<ProductCardProps> = ({
  context,
  model,
  labels,
  slots,
  className,
  testId,
}) => {
  const hasFooter = !!slots?.footerActions || labels.viewLabel.trim().length > 0

  return (
    <div data-testid={testId} className="h-full">
      <DataCard
        href={model.href}
        className={cn(gridCardClasses[context], className)}
        linkAriaLabel={model.title || labels.viewLabel}
      >
        <ProductMedia
          context={context}
          view="grid"
          model={model}
          featuredLabel={labels.featuredLabel}
          outOfStockLabel={labels.outOfStockLabel}
          lowStockLabel={labels.lowStockLabel}
          topRight={slots?.topRight}
          mediaOverlay={slots?.mediaOverlay}
        />

        <DataCard.Header className={cn('mb-2', context === 'admin' && 'mb-3')}>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={titleClasses[context]}>{model.title}</h3>
              {model.subtitle && <p className={subtitleClasses[context]}>{model.subtitle}</p>}
            </div>
            {context !== 'clientCatalog' && (
              <ProductMetrics
                context={context}
                model={model}
                pointsLabel={labels.pointsLabel}
                stockLabel={labels.stockLabel}
              />
            )}
          </div>
        </DataCard.Header>

        <DataCard.Content className={cn('mb-0 gap-3', context === 'admin' && 'gap-2')}>
          {model.description && <p className={descriptionClasses[context]}>{model.description}</p>}

          {context === 'clientCatalog' && (
            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
              <ProductMetrics context={context} model={model} pointsLabel={labels.pointsLabel} />
            </div>
          )}

          <ProductMeta context={context} model={model} metaChips={slots?.metaChips} />
        </DataCard.Content>

        {hasFooter && (
          <DataCard.Footer className={footerClasses[context]}>
            {labels.viewLabel.trim() && (
              <span className="inline-flex items-center gap-2">
                {labels.viewLabel}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            {slots?.footerActions && (
              <div className="contents" data-card-action>
                {slots.footerActions}
              </div>
            )}
          </DataCard.Footer>
        )}
      </DataCard>
    </div>
  )
}

const ProductCardList: FC<ProductCardProps> = ({
  context,
  model,
  labels,
  slots,
  className,
  testId,
}) => {
  const hasFooter = !!slots?.footerActions || labels.viewLabel.trim().length > 0

  return (
    <div data-testid={testId} className={listContainerClasses[context]}>
      <DataListItem
        href={model.href}
        className={className}
        linkAriaLabel={model.title || labels.viewLabel}
      >
        <DataListItemHeader>
          <div className="flex items-center gap-3">
            <ProductMedia
              context={context}
              view="list"
              model={model}
              featuredLabel={labels.featuredLabel}
              outOfStockLabel={labels.outOfStockLabel}
              lowStockLabel={labels.lowStockLabel}
            />
            <div className="min-w-0 flex-1">
              <h3 className={titleClasses[context]}>{model.title}</h3>
              {model.subtitle && <p className={subtitleClasses[context]}>{model.subtitle}</p>}
            </div>
            {slots?.topRight && (
              <div className="pointer-events-auto" data-card-action>
                {slots.topRight}
              </div>
            )}
          </div>
        </DataListItemHeader>

        <DataListItemContent>
          <div className="space-y-2">
            <ProductMetrics
              context={context}
              model={model}
              pointsLabel={labels.pointsLabel}
              stockLabel={labels.stockLabel}
            />
            {model.description && (
              <p className={descriptionClasses[context]}>{model.description}</p>
            )}
            <ProductMeta context={context} model={model} metaChips={slots?.metaChips} />
          </div>
        </DataListItemContent>

        {hasFooter && (
          <DataListItemActions>
            <div className="flex w-full items-center justify-between gap-3">
              {labels.viewLabel.trim() && (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {labels.viewLabel}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
              {slots?.footerActions && (
                <div className="contents" data-card-action>
                  {slots.footerActions}
                </div>
              )}
            </div>
          </DataListItemActions>
        )}
      </DataListItem>
    </div>
  )
}

export const ProductCard: FC<ProductCardProps> = ({ view = 'grid', ...props }) => {
  if (view === 'list') {
    return <ProductCardList view={view} {...props} />
  }

  return <ProductCardGrid view={view} {...props} />
}
