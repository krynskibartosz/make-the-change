'use client'

import { DataList } from '@make-the-change/core/ui'
import { ProjectCard } from '@make-the-change/core/ui/next'
import { buildProjectCardBadges } from '@/features/investment/project-card-badges'
import { sanitizeImageUrl } from '@/lib/image-url'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  description_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
  status?: string | null
  featured?: boolean | null
}

type FeaturedProjectsListProps = {
  projects: FeaturedProject[]
  activeLabel: string
  fundedLabel: string
}

const renderProjectCard = (
  project: FeaturedProject,
  labels: {
    activeLabel: string
    fundedLabel: string
  },
  priority = false,
) => {
  const title = project.name_default || 'Project'
  const badges = buildProjectCardBadges({
    featured: project.featured,
    status: project.status,
    labels: {
      featuredLabel: undefined,
      activeLabel: labels.activeLabel,
      fundedLabel: labels.fundedLabel,
    },
  })

  return (
    <ProjectCard
      context="clientHome"
      model={{
        id: project.id,
        href: `/projects/${project.slug}`,
        title,
        description: project.description_default || '',
        image: {
          src: sanitizeImageUrl(project.hero_image_url),
          alt: title,
        },
        imagePriority: priority,
        status: project.status,
        featured: project.featured,
        progressPercent:
          project.target_budget && project.target_budget > 0
            ? ((project.current_funding || 0) / project.target_budget) * 100
            : 0,
        currentFundingEuro: project.current_funding,
        targetBudgetEuro: project.target_budget,
        badges,
      }}
      labels={{
        viewLabel: '',
        progressLabel: '',
        fundedLabel: labels.fundedLabel,
        goalLabel: '',
      }}
    />
  )
}

export function FeaturedProjectsList({
  projects,
  activeLabel,
  fundedLabel,
}: FeaturedProjectsListProps) {
  const labels = { activeLabel, fundedLabel }

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">Aucun projet en vedette pour le moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 px-1">
          {projects.map((project, index) => (
            <div key={project.id} className="min-w-[280px] max-w-[320px] flex-1">
              {renderProjectCard(project, labels, index === 0)}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <DataList
          items={projects}
          gridCols={3}
          isLoading={false}
          getItemKey={(project) => project.id}
          renderItem={(project) => renderProjectCard(project, labels)}
          renderSkeleton={() => <div className="h-64 rounded-3xl bg-muted animate-pulse" />}
          emptyState={{
            title: 'Aucun projet',
            description: 'Aucun projet en vedette pour le moment.',
          }}
        />
      </div>
    </>
  )
}
