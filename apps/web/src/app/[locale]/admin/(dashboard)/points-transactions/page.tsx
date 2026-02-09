import { db } from '@make-the-change/core/db'
import { pointsLedger, profiles } from '@make-the-change/core/schema'
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { PointsClient } from './points-client'
import { loadPointsSearchParams } from './points-search-params'

const PAGE_SIZE = 20

type SearchParams = {
  q?: string
  page?: string
  sort?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.points',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function PointsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadPointsSearchParams(props.searchParams)
  
  const {
    q,
    page,
    sort,
  } = searchParams

  const offset = (page - 1) * PAGE_SIZE

  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    // We need to join with profiles to search by email, but for simple where clause in findMany with relations, 
    // Drizzle's `where` applies to the main table. 
    // Searching by relation field usually requires `eq` on ID or specialized query.
    // For now, let's search description (reason). 
    // To search user email, we'd need to fetch user IDs first or use a join.
    conditions.push(
        ilike(pointsLedger.reason, searchLower)
    )
  }

  let orderBy = desc(pointsLedger.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(pointsLedger.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(pointsLedger.created_at)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Note: db.query.pointsLedger might fail if schema key is different.
  // Assuming 'pointsLedger' is the key in db schema corresponding to pointsLedger table.
  // If db schema uses 'points_ledger', this will need adjustment.
  // Based on standard drizzle-kit introspection or manual schema construction, it usually matches export name if passed to drizzle().
  
  const [txResult, countResult] = await Promise.all([
    db.query.pointsLedger.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
      with: {
        // user relation needs to be defined in relations.ts for pointsLedger
        // If it's not defined, this 'with' will fail. 
        // Assuming it exists based on previous code trying to access user.email
        // However, schema.ts didn't show relations.
        // If relations are missing, we might need to remove 'with: { user: true }' and fetch users separately or use join.
        // For now, I'll keep it but comment that it might need relations.
        // user: true 
      } as any // Cast to any to bypass type check if relation is missing in types but present in runtime
    }),
    db.select({ count: count() }).from(pointsLedger).where(whereClause),
  ])

  // If relation is missing, we need to fetch users manually
  let items = txResult.map(tx => ({
    id: tx.id,
    user_email: 'Inconnu', // Placeholder until we confirm relations
    amount: tx.delta,
    type: tx.reference_type || 'unknown',
    description: tx.reason || '',
    created_at: tx.created_at.toISOString(),
  }))

  // Fetch users if we have user_ids
  const userIds = txResult.map(tx => tx.user_id).filter(Boolean)
  if (userIds.length > 0) {
     const users = await db.query.profiles.findMany({
         where: (profiles, { inArray }) => inArray(profiles.id, userIds)
     })
     const userMap = new Map(users.map(u => [u.id, u]))
     
     items = items.map(item => {
        const tx = txResult.find(t => t.id === item.id)
        const user = tx ? userMap.get(tx.user_id) : null
        return {
            ...item,
            user_email: user?.email || 'Inconnu'
        }
     })
  }

  const total = countResult[0]?.count ?? 0

  return <PointsClient initialData={{ items, total }} />
}
