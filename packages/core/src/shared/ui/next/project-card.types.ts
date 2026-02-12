import type { ReactNode } from 'react'

export type ProjectCardContext = 'admin' | 'clientCatalog' | 'clientHome'
export type ProjectCardView = 'grid' | 'list'
export type ProjectCardBadgeTone = 'primary' | 'danger' | 'neutral' | 'success' | 'warning'

export type ProjectCardBadge = {
  id: string
  label: string
  tone?: ProjectCardBadgeTone
}

export type ProjectCardModel = {
  id: string
  href?: string
  title: string
  subtitle?: string
  description?: string
  image?: { src?: string | null; alt: string; blurDataURL?: string | null }
  imagePriority?: boolean
  status?: string | null
  featured?: boolean | null
  projectType?: string | null
  producerName?: string | null
  locationLabel?: string | null
  progressPercent?: number | null
  currentFundingEuro?: number | null
  targetBudgetEuro?: number | null
  launchDateLabel?: string | null
  badges?: ProjectCardBadge[] | null
}

export type ProjectCardLabels = {
  viewLabel: string
  progressLabel?: string
  fundedLabel?: string
  goalLabel?: string
  featuredLabel?: string
  activeLabel?: string
}

export type ProjectCardSlots = {
  topRight?: ReactNode
  footerActions?: ReactNode
  metaChips?: ReactNode
  mediaOverlay?: ReactNode
}

export type ProjectCardProps = {
  context: ProjectCardContext
  view?: ProjectCardView
  model: ProjectCardModel
  labels: ProjectCardLabels
  slots?: ProjectCardSlots
  className?: string
  testId?: string
}

export type ProjectCardSkeletonProps = {
  context: ProjectCardContext
  view?: ProjectCardView
  className?: string
}
