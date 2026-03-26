import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { FeaturedProjectsList } from '@/app/[locale]/(marketing)/(home)/_features/featured-projects-list'
import { Link } from '@/i18n/navigation'
import type { HomeFeaturedProject } from './home.types'

type HomeFeaturedProjectsSectionProps = {
  title: string
  viewAllLabel: string
  supportLabel: string
  collectedLabel: string
  goalLabel: string
  projects: HomeFeaturedProject[]
  variant?: 'default' | 'muted'
}

export const HomeFeaturedProjectsSection = ({
  title,
  viewAllLabel,
  supportLabel,
  collectedLabel,
  goalLabel,
  projects,
  variant = 'default',
}: HomeFeaturedProjectsSectionProps) => (
  <MarketingSection title={title} variant={variant} size="lg" className="dark:!bg-black">
    <FeaturedProjectsList
      projects={projects}
      supportLabel={supportLabel}
      collectedLabel={collectedLabel}
      goalLabel={goalLabel}
      viewAllLabel={viewAllLabel}
    />
  </MarketingSection>
)
