import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { FeaturedProjectsList } from '@/components/featured-projects-list'
import { MarketingSection } from '@/components/marketing/marketing-section'
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
}

export function HomeFeaturedProjectsSection({
  title,
  viewAllLabel,
  fundedLabel,
  activeLabel,
  projects,
}: HomeFeaturedProjectsSectionProps) {
  return (
    <MarketingSection
      title={title}
      action={
        <Link href="/projects">
          <Button
            variant="ghost"
            className="flex items-center font-bold uppercase tracking-widest text-xs"
          >
            {viewAllLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      }
      variant="muted"
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
