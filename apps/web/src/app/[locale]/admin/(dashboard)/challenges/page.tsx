import { db } from '@make-the-change/core/db'
import { challenges } from '@make-the-change/core/schema'
import { and, asc, count, desc, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { ChallengesClient } from './challenges-client'
import { loadChallengesSearchParams } from './challenges-search-params'

const PAGE_SIZE = 10

type SearchParams = {
  q?: string
  page?: string
  sort?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: `Challenges | Admin`,
  }
}

export default async function AdminChallengesPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadChallengesSearchParams(props.searchParams)
  
  const { q, page, sort } = searchParams

  const offset = (page - 1) * PAGE_SIZE

  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(challenges.title, searchLower),
        ilike(challenges.slug, searchLower),
      ),
    )
  }

  let orderBy = desc(challenges.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(challenges.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(challenges.created_at)
        break
      case 'title_asc':
        orderBy = asc(challenges.title)
        break
      case 'title_desc':
        orderBy = desc(challenges.title)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [challengesResult, countResult] = await Promise.all([
    db.query.challenges.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
    }),
    db.select({ count: count() }).from(challenges).where(whereClause),
  ])

  const items = challengesResult.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    type: c.type,
    status: c.status,
    reward_points: c.reward_points,
    reward_badge: c.reward_badge,
    created_at: c.created_at?.toISOString() ?? new Date().toISOString(),
  }))

  const total = countResult[0]?.count ?? 0

  return <ChallengesClient initialData={{ items, total }} />
}
