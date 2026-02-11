import { Badge, Button, Card, CardContent, Progress } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { FeaturedProjectsList } from '@/components/featured-projects-list'
import { MarketingSection } from '@/components/marketing/marketing-section'
import { Link } from '@/i18n/navigation'
import { getRandomProjectImage } from '@/lib/placeholder-images'
import { formatPoints } from '@/lib/utils'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
  description_default: string | null
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
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 px-1">
          {projects.map((project) => {
            const fundingProgress = project.target_budget
              ? ((project.current_funding || 0) / project.target_budget) * 100
              : 0
            const imageUrl =
              project.hero_image_url || getRandomProjectImage(project.name_default?.length || 0)

            return (
              <Link key={project.id} href={`/projects/${project.slug}`} className="min-w-[280px]">
                <Card className="overflow-hidden border bg-background/70 backdrop-blur shadow-lg rounded-3xl">
                  <div className="relative h-40 w-full">
                    <img
                      src={imageUrl}
                      alt={project.name_default || 'Project'}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-marketing-positive-500 border-none text-[10px] font-black uppercase">
                      {activeLabel}
                    </Badge>
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <h3 className="text-lg font-black tracking-tight">{project.name_default}</h3>
                    {project.target_budget && (
                      <div className="space-y-2">
                        <Progress value={fundingProgress} className="h-1.5" />
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <span>
                            {Math.round(fundingProgress || 0)}
                            {fundedLabel}
                          </span>
                          <span className="text-foreground">
                            {formatPoints(project.target_budget)}€
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="hidden md:block">
        <FeaturedProjectsList projects={projects} />
      </div>
    </MarketingSection>
  )
}
