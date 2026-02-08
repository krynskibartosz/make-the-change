import { db } from '@make-the-change/core/db'
import { projects } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireProducer, requireProducerOrAdminPage } from '@/lib/auth-guards'
import type { Project } from '@/lib/types/project'
import { ProjectsClient } from './projects-client'

const PAGE_SIZE = 20

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'partner.projects' })
  return { title: `${t('title')} | Partner` }
}

export default async function PartnerProjectsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireProducerOrAdminPage(locale)
  const { producer } = await requireProducer()
  const searchParams = await props.searchParams
  const { q, status: statusFilter, page } = searchParams

  if (!producer) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Profil producteur non configuré</h1>
        <p className="text-muted-foreground">
          Votre compte n'est pas encore associé à un profil producteur.
        </p>
      </div>
    )
  }

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build conditions - TOUJOURS filtrer par producer_id
  const conditions = [eq(projects.producer_id, producer.id)]

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(projects.name_default, searchLower),
        ilike(projects.description_default, searchLower),
      )!,
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    conditions.push(eq(projects.status, statusFilter as any))
  }

  const whereClause = and(...conditions)

  let projectRows: Project[] = []
  let totalResult: Array<{ count: number }> = [{ count: 0 }]

  try {
    const [projectsResult, countResult] = await Promise.all([
      db.query.projects.findMany({
        where: whereClause,
        orderBy: desc(projects.created_at),
        limit: PAGE_SIZE,
        offset: offset,
        // No relations needed for partner view currently, or maybe producer if needed for consistency
        // Partner view filters by producer_id anyway.
      }),
      db.select({ count: count() }).from(projects).where(whereClause),
    ])

    projectRows = projectsResult.map((p) => ({
      ...p,
      // Conversions similar to filters in admin page
      funding_progress: p.funding_progress ? Number(p.funding_progress) : null,
      current_funding: p.current_funding ? Number(p.current_funding) : null,
      target_budget: p.target_budget ? Number(p.target_budget) : null,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
      deleted_at: p.deleted_at?.toISOString() ?? null,
      launch_date: p.launch_date ?? null,
      maturity_date: p.maturity_date ?? null,

      // Type casting for complex JSON fields - no more 'as any'
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
      producer_name: producer?.name ?? null,
    })) as Project[]
    
    totalResult = countResult
  } catch (error) {
    console.error('CRITIQUE: Erreur projets partner:', error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  return (
    <ProjectsClient
      initialProjects={{
        items: projectRows,
        total: currentTotal,
      }}
    />
  )
}
