import type { ProjectDetailTabId } from '../_components/project-detail-tabs'

type ProjectDetailCtaLabelInput = {
  activeTab: ProjectDetailTabId
  isFundingClosed: boolean
  isContributionProject: boolean
  closedLabel: string
  contributionCtaLabel: string
  supportCtaLabel: string
}

export function getProjectDetailCtaLabel({
  activeTab,
  isFundingClosed,
  isContributionProject,
  closedLabel,
  contributionCtaLabel,
  supportCtaLabel,
}: ProjectDetailCtaLabelInput): string {
  if (isFundingClosed) return closedLabel
  if (isContributionProject) return contributionCtaLabel
  if (activeTab === 'impact') return 'Voir les contreparties'
  return supportCtaLabel
}
