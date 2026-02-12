import type { ProductCardBadge } from '@make-the-change/core/ui/next'

type ProductCardBadgeLabels = {
  featuredLabel?: string
  outOfStockLabel?: string
  lowStockLabel?: string
}

type BuildProductCardBadgesParams = {
  featured?: boolean | null
  stockQuantity?: number | null
  labels: ProductCardBadgeLabels
}

export const buildProductCardBadges = ({
  featured,
  stockQuantity,
  labels,
}: BuildProductCardBadgesParams): ProductCardBadge[] => {
  const badges: ProductCardBadge[] = []

  if (featured && labels.featuredLabel) {
    badges.push({
      id: 'featured',
      label: labels.featuredLabel,
      tone: 'primary',
    })
  }

  if (stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0) {
    if (labels.outOfStockLabel) {
      badges.push({
        id: 'out-of-stock',
        label: labels.outOfStockLabel,
        tone: 'neutral',
      })
    }

    return badges
  }

  if (
    stockQuantity !== null &&
    stockQuantity !== undefined &&
    stockQuantity > 0 &&
    stockQuantity <= 5 &&
    labels.lowStockLabel
  ) {
    badges.push({
      id: 'low-stock',
      label: labels.lowStockLabel,
      tone: 'danger',
    })
  }

  return badges
}
