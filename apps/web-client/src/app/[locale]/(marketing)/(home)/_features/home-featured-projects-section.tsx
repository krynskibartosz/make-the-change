import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { FeaturedProjectsList } from '@/app/[locale]/(marketing)/(home)/_features/featured-projects-list'
import type { HomeFeaturedProject } from './home.types'

type HomeFeaturedProjectsSectionProps = {
  title: string
  viewAllLabel: string
  projects: HomeFeaturedProject[]
  variant?: 'default' | 'muted'
}

export const HomeFeaturedProjectsSection = ({
  title,
  viewAllLabel,
  projects,
  variant = 'default',
}: HomeFeaturedProjectsSectionProps) => (
  <MarketingSection title={title} variant={variant} size="lg" className="dark:!bg-black">
    <FeaturedProjectsList projects={projects} viewAllLabel={viewAllLabel} />
  </MarketingSection>
)
