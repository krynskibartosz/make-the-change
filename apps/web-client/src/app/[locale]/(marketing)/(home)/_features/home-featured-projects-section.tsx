import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { FeaturedProjectsList } from '@/app/[locale]/(marketing)/(home)/_features/featured-projects-list'
import type { HomeFeaturedProject } from './home.types'
import { HomeSectionViewAllAction } from './home-section-view-all-action'

type HomeFeaturedProjectsSectionProps = {
  title: string
  viewAllLabel: string
  fundedLabel: string
  activeLabel: string
  projects: HomeFeaturedProject[]
  variant?: 'default' | 'muted'
}

export const HomeFeaturedProjectsSection = ({
  title,
  viewAllLabel,
  fundedLabel,
  activeLabel,
  projects,
  variant = 'default',
}: HomeFeaturedProjectsSectionProps) => (
  <MarketingSection
    title={title}
    action={<HomeSectionViewAllAction href="/projects" label={viewAllLabel} />}
    variant={variant}
    size="lg"
  >
    <FeaturedProjectsList projects={projects} activeLabel={activeLabel} fundedLabel={fundedLabel} />
  </MarketingSection>
)
