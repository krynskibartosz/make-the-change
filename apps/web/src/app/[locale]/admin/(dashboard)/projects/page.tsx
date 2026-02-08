/**
 * Admin Projects Page - React Server Component
 * Direct DB access with server-side filtering and pagination
 */

import { db } from '@make-the-change/core/db'
import { producers, projects } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Project } from '@/lib/types/project'
import { PAGE_SIZE } from './constants'
import { ProjectsClient } from './projects-client'

const projectStatuses = ['draft', 'active', 'funded', 'completed', 'archived'] as const
type ProjectStatus = (typeof projectStatuses)[number]
const isProjectStatus = (value: string): value is ProjectStatus =>
  (projectStatuses as readonly string[]).includes(value)

const projectTypes = ['beehive', 'olive_tree', 'vineyard'] as const
type ProjectType = (typeof projectTypes)[number]
const isProjectType = (value: string): value is ProjectType =>
  (projectTypes as readonly string[]).includes(value)

type SearchParams = {
  q?: string
  status?: string
  type?: string
  sort?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.projects' })

  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function AdminProjectsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await props.searchParams
  const { q, status: statusFilter, type: typeFilter, page } = searchParams

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build Filter Conditions
  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(projects.name_default, searchLower),
        ilike(projects.description_default, searchLower),
        ilike(projects.slug, searchLower),
      ),
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    if (isProjectStatus(statusFilter)) {
      conditions.push(eq(projects.status, statusFilter))
    }
  }

  if (typeFilter && typeFilter !== 'all') {
    if (isProjectType(typeFilter)) {
      conditions.push(eq(projects.type, typeFilter))
    }
  }

  // Handle Sort
  const orderBy = desc(projects.created_at)
  // Add sort handling logic based on 'sort' param if needed in future

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  type ProjectDbRow = typeof projects.$inferSelect

  let projectsList: Project[] = []
  let totalResult: { count: number }[] = []

  try {
    const [projectsResult, countResult] = await Promise.all([
      // 1. Projects (Paginated & Filtered)
      db.query.projects.findMany({
        where: whereClause,
        orderBy: orderBy,
        limit: PAGE_SIZE,
        offset: offset,
        with: {
          producer: {
            columns: {
              id: true,
              name_default: true,
            },
          },
        },
      }),

      // 2. Count (Filtered)
      db.select({ count: count() }).from(projects).where(whereClause),
    ])
    
    totalResult = countResult

    projectsList = projectsResult.map((p) => ({
      ...p,
      // Number conversions
      funding_progress: p.funding_progress ? Number(p.funding_progress) : null,
      current_funding: p.current_funding ? Number(p.current_funding) : null,
      target_budget: p.target_budget ? Number(p.target_budget) : null,
      
      // Date conversions
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
      deleted_at: p.deleted_at?.toISOString() ?? null,
      launch_date: p.launch_date ?? null,
      maturity_date: p.maturity_date ?? null,

      // JSON/Complex types casting
      description_i18n: (p.description_i18n as Project['description_i18n']) ?? null,
      long_description_i18n: (p.long_description_i18n as Project['long_description_i18n']) ?? null,
      name_i18n: (p.name_i18n as Project['name_i18n']) ?? null,
      impact_metrics: (p.impact_metrics as Project['impact_metrics']) ?? null,
      metadata: (p.metadata as Project['metadata']) ?? null,
      location: (p.location as Project['location']) ?? null,
      address_coordinates: (p.address_coordinates as Project['address_coordinates']) ?? null,
      
      // Default fields
      name: p.name_default ?? '',
      description: p.description_default ?? '',
      address: {
        city: p.address_city,
        country: p.address_country_code,
        street: p.address_street,
        postal_code: p.address_postal_code,
        region: p.address_region,
      },
      images: p.gallery_image_urls ?? [],
      
      // Relations
      producer: p.producer ? { id: p.producer.id, name_default: p.producer.name_default } : null,
      producer_name: p.producer?.name_default ?? null, 
    })) as Project[]

  } catch (error) {
    console.error('CRITIQUE: Erreur lors de la récupération des projets:', error)
    // On continue avec des tableaux vides pour ne pas crasher l'UI
  }

  const currentTotal = totalResult[0]?.count ?? 0

  return (
    <ProjectsClient
      initialData={{
        items: projectsList,
        total: currentTotal,
      }}
    />
  )
}
