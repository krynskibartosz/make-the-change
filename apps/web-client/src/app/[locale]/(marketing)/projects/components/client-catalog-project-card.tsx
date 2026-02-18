'use client'

import { ProjectCard } from '@make-the-change/core/ui/next'
import type { FC } from 'react'
import { buildProjectCardBadges } from '@/app/[locale]/(marketing)/projects/_features/project-card-badges'
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

export const ClientCatalogProjectCard: FC<ClientCatalogProjectCardProps> = ({
  project,
  labels,
}) => {
  const imageUrl = sanitizeImageUrl(project.hero_image_url)
  const badges = buildProjectCardBadges({
    featured: project.featured,
    status: project.status,
    labels: {
      featuredLabel: labels.featuredLabel,
      activeLabel: labels.activeLabel,
      fundedLabel: labels.fundedLabel,
    },
  })

  return (
    <div itemScope itemType="https://schema.org/Project">
      <ProjectCard
        context="clientCatalog"
        model={{
          id: project.id,
          href: `/projects/${project.slug}`,
          title: project.name_default,
          subtitle: getLocationLabel(project),
          description: project.description_default || '',
          image: {
            src: imageUrl || '',
            alt: project.name_default,
          },
          status: project.status,
          featured: project.featured,
          projectType: project.type || undefined,
          producerName: project.producer?.name_default || undefined,
          locationLabel: getLocationLabel(project),
          progressPercent: getProgressPercent(project),
          currentFundingEuro: project.current_funding,
          targetBudgetEuro: project.target_budget,
          badges,
        }}
        labels={{
          viewLabel: labels.viewLabel,
          progressLabel: labels.progressLabel,
          fundedLabel: labels.fundedLabel,
          goalLabel: labels.goalLabel,
        }}
      />
      <meta itemProp="name" content={project.name_default} />
      <meta itemProp="description" content={project.description_default || ''} />
      <meta itemProp="image" content={imageUrl || ''} />
      {project.address_city && project.address_country_code && (
        <meta itemProp="location" content={`${project.address_city}, ${project.address_country_code}`} />
      )}
    </div>
  )
}
