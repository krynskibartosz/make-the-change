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
            className="h-full transition-all hover:-translate-y-1 hover:shadow-xl p-0 gap-0"
          >
            <div className="relative h-48 w-full shrink-0 overflow-hidden">
              <img
                src={
                  project.hero_image_url ||
                  getRandomProjectImage(project.name_default?.length || 0)
                }
                alt={project.name_default || 'Project'}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-client-black/60 via-transparent to-transparent opacity-60" />
              <Badge variant="success" className="absolute top-4 right-4 shadow-sm">
                Actif
              </Badge>
            </div>

            <div className="flex flex-col flex-1 p-6">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {project.name_default}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground flex-1">
                {project.description_default}
              </p>
              {project.target_budget && (
                <div className="space-y-2 mt-auto pt-2">
                  <Progress value={fundingProgress} className="h-2" />
                  <div className="flex justify-between text-xs font-medium uppercase tracking-wide">
                    <span>{Math.round(fundingProgress || 0)}% financé</span>
                    <span className="text-muted-foreground">
                      {formatPoints(project.target_budget!)}€
                    </span>
                  </div>
                </div>
              )}
            </div>
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
