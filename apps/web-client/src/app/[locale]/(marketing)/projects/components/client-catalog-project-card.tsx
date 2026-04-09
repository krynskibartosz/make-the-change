'use client'

import { Target } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

export type ClientCatalogProject = {
  id: string
  slug: string
  name_default: string
  description_default?: string | null
  target_budget?: number | null
  current_funding?: number | null
  funding_progress?: number | null
  address_city?: string | null
  address_country_code?: string | null
  featured?: boolean | null
  status?: string | null
  hero_image_url?: string | null
  type?: string | null
  latitude?: number | null
  longitude?: number | null
  producer?: { name_default?: string | null } | null
}

type ClientCatalogProjectCardProps = {
  project: ClientCatalogProject
  labels: {
    viewLabel: string
    progressLabel: string
    fundedLabel: string
    goalLabel: string
    featuredLabel: string
    activeLabel: string
  }
  view?: 'grid' | 'list'
}

const getLocationLabel = (project: ClientCatalogProject): string | undefined => {
  if (project.address_city && project.address_country_code) {
    return `${project.address_city}, ${project.address_country_code}`
  }

  return undefined
}

const getProgressPercent = (project: ClientCatalogProject): number | null => {
  if (project.funding_progress !== null && project.funding_progress !== undefined) {
    return project.funding_progress
  }

  if (
    project.current_funding !== null &&
    project.current_funding !== undefined &&
    project.target_budget !== null &&
    project.target_budget !== undefined &&
    project.target_budget > 0
  ) {
    return (project.current_funding / project.target_budget) * 100
  }

  return null
}

export const ClientCatalogProjectCard = ({
  project,
  labels,
  view = 'grid',
}: ClientCatalogProjectCardProps) => {
  const imageUrl = sanitizeImageUrl(project.hero_image_url)
  const locationLabel = getLocationLabel(project)
  const progressPercent = getProgressPercent(project)
  const isListView = view === 'list'

  return (
    <div itemScope itemType="https://schema.org/Project" className={isListView ? undefined : 'h-full'}>
      <Link
        href={`/projects/${project.slug}`}
        className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-card transition-all hover:border-white/20 hover:shadow-xl ${
          isListView ? 'flex flex-col md:flex-row' : 'flex h-full flex-col'
        }`}
      >
        <meta itemProp="name" content={project.name_default} />
        <meta itemProp="description" content={project.description_default || ''} />
        <meta itemProp="image" content={imageUrl || ''} />
        {project.address_city && project.address_country_code && (
          <meta
            itemProp="location"
            content={`${project.address_city}, ${project.address_country_code}`}
          />
        )}
        
        {/* Badges Flottants */}
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {project.featured && (
            <span className="rounded-full bg-lime-500/20 border border-lime-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 backdrop-blur-sm shadow-sm">
              Coup de cœur
            </span>
          )}
        </div>

        {/* Zone Image */}
        <div
          className={`relative overflow-hidden bg-muted flex-shrink-0 ${
            isListView ? 'aspect-video w-full md:h-auto md:w-72' : 'aspect-video w-full'
          }`}
        >
          <Image
            src={imageUrl || ''}
            alt={project.name_default}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Contenu - Avec un padding généreux */}
        <div className={`flex flex-1 flex-col p-5 ${isListView ? 'md:p-6' : ''}`}>
          <div className="mb-2 flex items-center gap-3">
            <Target className="h-5 w-5 text-muted-foreground shrink-0" />
            <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-foreground">
              {project.name_default}
            </h3>
          </div>

          <p className={`text-sm text-muted-foreground mb-6 ${isListView ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {project.description_default}
          </p>

          <div className="mt-auto flex flex-col gap-3">
            {project.current_funding !== null && project.current_funding !== undefined && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg leading-none">{project.current_funding.toLocaleString()} €</span>
                  {project.target_budget !== null && project.target_budget !== undefined && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {project.target_budget.toLocaleString()} € {labels.goalLabel}
                    </span>
                  )}
                </div>
                {progressPercent !== null && (
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-lime-400 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="font-medium text-lime-400 text-sm mt-1 mb-1 self-start group-hover:underline">
              {labels.viewLabel} &rarr;
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
