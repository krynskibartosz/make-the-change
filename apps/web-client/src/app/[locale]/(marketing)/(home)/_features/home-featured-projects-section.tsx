import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { FeaturedProjectsList } from '@/app/[locale]/(marketing)/(home)/_features/featured-projects-list'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { Link } from '@/i18n/navigation'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
  description_default: string | null
  status?: string | null
  featured?: boolean | null
}

type HomeFeaturedProjectsSectionProps = {
  title: string
  viewAllLabel: string
  fundedLabel: string
  activeLabel: string
  projects: FeaturedProject[]
  variant?: 'default' | 'muted'
}

export function HomeFeaturedProjectsSection({
  title,
  viewAllLabel,
  fundedLabel,
  activeLabel,
  projects,
  variant = 'default',
}: HomeFeaturedProjectsSectionProps) {
  return (
    <MarketingSection
      title={title}
      action={
        <Link href="/projects" aria-label={viewAllLabel}>
          <Button
            variant="ghost"
            className="flex items-center font-bold uppercase tracking-widest text-xs"
          >
            {viewAllLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      }
      variant={variant}
      size="lg"
    >
      <FeaturedProjectsList
        projects={projects}
        activeLabel={activeLabel}
        fundedLabel={fundedLabel}
      />
    </MarketingSection>
  )
}
