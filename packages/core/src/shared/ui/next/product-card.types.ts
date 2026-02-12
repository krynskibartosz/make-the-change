import type { ReactNode } from 'react'

export type ProductCardContext = 'admin' | 'clientCatalog' | 'clientHome'
export type ProductCardView = 'grid' | 'list'
export type ProductCardBadgeTone = 'primary' | 'danger' | 'neutral' | 'success' | 'warning'

export type ProductCardBadge = {
  id: string
  label: string
  tone?: ProductCardBadgeTone
}

export type ProductCardModel = {
  id: string
  href?: string
  title: string
  subtitle?: string
  description?: string
  image?: { src?: string | null; alt: string; blurDataURL?: string | null }
  imagePriority?: boolean
  hoverImageSrc?: string | null
  pricePoints?: number | null
  priceEuro?: number | null
  stockQuantity?: number | null
  isActive?: boolean | null
  featured?: boolean | null
  categoryName?: string | null
  producerName?: string | null
  tags?: string[] | null
  partnerSource?: string | null
  badges?: ProductCardBadge[] | null
}

export type ProductCardLabels = {
  pointsLabel: string
  viewLabel: string
  stockLabel?: string
  featuredLabel?: string
  outOfStockLabel?: string
  lowStockLabel?: string
}

export type ProductCardSlots = {
  topRight?: ReactNode
  footerActions?: ReactNode
  metaChips?: ReactNode
  mediaOverlay?: ReactNode
}

export type ProductCardProps = {
  context: ProductCardContext
  view?: ProductCardView
  model: ProductCardModel
  labels: ProductCardLabels
  slots?: ProductCardSlots
  className?: string
  testId?: string
}

export type ProductCardSkeletonProps = {
  context: ProductCardContext
  view?: ProductCardView
  className?: string
}
