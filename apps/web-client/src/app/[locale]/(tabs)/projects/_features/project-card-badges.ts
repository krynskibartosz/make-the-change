import type { ProjectCardBadge } from '@make-the-change/core/ui/next'

type ProjectCardBadgeLabels = {
  featuredLabel?: string
  activeLabel?: string
  fundedLabel?: string
}

type BuildProjectCardBadgesParams = {
  featured?: boolean | null
  status?: string | null
  labels: ProjectCardBadgeLabels
}

export const buildProjectCardBadges = ({
  featured,
  status,
  labels,
}: BuildProjectCardBadgesParams): ProjectCardBadge[] => {
  const badges: ProjectCardBadge[] = []
  const normalizedStatus = status?.toLowerCase()

  if (featured && labels.featuredLabel) {
    badges.push({
      id: 'featured',
      label: labels.featuredLabel,
      tone: 'primary',
    })
  }

  if (normalizedStatus === 'active' && labels.activeLabel) {
    badges.push({
      id: 'active',
      label: labels.activeLabel,
      tone: 'success',
    })
  }

  if ((normalizedStatus === 'funded' || normalizedStatus === 'completed') && labels.fundedLabel) {
    badges.push({
      id: normalizedStatus,
      label: labels.fundedLabel,
      tone: 'neutral',
    })
  }

  return badges
}
