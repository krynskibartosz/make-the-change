'use client'

import { DataList } from '@make-the-change/core/ui'
import { ProjectCard } from '@make-the-change/core/ui/next'
import { buildProjectCardBadges } from '@/app/[locale]/(marketing)/projects/_features/project-card-badges'
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

type ProjectCardLabels = {
  activeLabel: string
  fundedLabel: string
}

const EMPTY_FEATURED_PROJECTS_MESSAGE = 'Aucun projet en vedette pour le moment.'

const renderProjectCard = (
  project: FeaturedProject,
  labels: ProjectCardLabels,
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
  const labels: ProjectCardLabels = { activeLabel, fundedLabel }

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">{EMPTY_FEATURED_PROJECTS_MESSAGE}</p>
      </div>
    )
  }

  return (
    <>
      <div className="md:hidden">
        <ul className="flex gap-4 overflow-x-auto pb-4 px-1 list-none m-0 p-0">
          {projects.map((project, index) => (
            <li key={project.id} className="min-w-[280px] max-w-[320px] flex-1">
              {renderProjectCard(project, labels, index === 0)}
            </li>
          ))}
        </ul>
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
            description: EMPTY_FEATURED_PROJECTS_MESSAGE,
          }}
        />
      </div>
    </>
  )
}
