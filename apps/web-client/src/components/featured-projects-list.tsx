'use client'

import { DataCard, DataList, Badge, Progress } from '@make-the-change/core/ui'
import LocalizedLink from '@/components/ui/localized-link'
import { formatPoints } from '@/lib/utils'
import { getRandomProjectImage } from '@/lib/placeholder-images'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  description_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
}

type FeaturedProjectsListProps = {
  projects: FeaturedProject[]
}

export function FeaturedProjectsList({ projects }: FeaturedProjectsListProps) {
  return (
    <DataList
      items={projects}
      gridCols={3}
      isLoading={false}
      getItemKey={(project) => project.id}
      renderItem={(project) => {
        const fundingProgress = project.target_budget
          ? (project.current_funding! / project.target_budget) * 100
          : 0
        return (
          <DataCard
            LinkComponent={LocalizedLink}
            href={`/projects/${project.slug}`}
            image={
              project.hero_image_url || getRandomProjectImage(project.name_default?.length || 0)
            }
            imageAlt={project.name_default || 'Project'}
            className="h-full transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{project.name_default}</h3>
              <Badge variant="success">Actif</Badge>
            </div>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {project.description_default}
            </p>
            {project.target_budget && (
              <div className="space-y-2 mt-auto">
                <Progress value={fundingProgress} />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {Math.round(fundingProgress || 0)}% financé
                  </span>
                  <span className="text-muted-foreground">
                    {formatPoints(project.target_budget!)}€
                  </span>
                </div>
              </div>
            )}
          </DataCard>
        )
      }}
      renderSkeleton={() => <div className="h-64 rounded-3xl bg-muted animate-pulse" />}
      emptyState={{
        title: 'Aucun projet',
        description: 'Aucun projet en vedette pour le moment.',
      }}
    />
  )
}
