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
  <MarketingSection title={title} variant={variant} size="lg" className="overflow-hidden bg-[#121619] text-white">
    <div
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(126,211,33,0.12),transparent_60%)]"
      aria-hidden="true"
    />
    <FeaturedProjectsList projects={projects} viewAllLabel={viewAllLabel} />
  </MarketingSection>
)
