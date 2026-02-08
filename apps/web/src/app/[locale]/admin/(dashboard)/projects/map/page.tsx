import { db } from '@make-the-change/core/db'
import { producers, projects } from '@make-the-change/core/schema'
import { desc, eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Project } from '@/lib/types/project'

import { ProjectsMapClient } from './projects-map-client'

export default async function ProjectsMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAdminPage(locale)

  const projectsResult = await db.query.projects.findMany({
    orderBy: desc(projects.created_at),
    limit: 50,
    with: {
      producer: {
        columns: {
          id: true,
          name_default: true,
        },
      },
    },
  })

  const projectsList: Project[] = projectsResult.map((project) => ({
    ...project,
    funding_progress: project.funding_progress ? Number(project.funding_progress) : null,
    current_funding: project.current_funding ? Number(project.current_funding) : null,
    target_budget: project.target_budget ? Number(project.target_budget) : null,
    created_at: project.created_at.toISOString(),
    updated_at: project.updated_at.toISOString(),
    deleted_at: project.deleted_at?.toISOString() ?? null,
    launch_date: project.launch_date ?? null,
    maturity_date: project.maturity_date ?? null,
    description_i18n: (project.description_i18n as Project['description_i18n']) ?? null,
    long_description_i18n:
      (project.long_description_i18n as Project['long_description_i18n']) ?? null,
    name_i18n: (project.name_i18n as Project['name_i18n']) ?? null,
    impact_metrics: (project.impact_metrics as Project['impact_metrics']) ?? null,
    metadata: (project.metadata as Project['metadata']) ?? null,
    location: (project.location as Project['location']) ?? null,
    address_coordinates: (project.address_coordinates as Project['address_coordinates']) ?? null,
    name: project.name_default ?? '',
    description: project.description_default ?? '',
    address: {
      city: project.address_city,
      country: project.address_country_code,
      street: project.address_street,
      postal_code: project.address_postal_code,
      region: project.address_region,
    },
    images: project.gallery_image_urls ?? [],
    producer: project.producer
      ? { id: project.producer.id, name_default: project.producer.name_default }
      : null,
    producer_name: project.producer?.name_default ?? null,
  }))

  return <ProjectsMapClient initialProjects={projectsList} />
}
