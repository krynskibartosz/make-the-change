import { requireAuth } from '@/app/[locale]/(auth)/_features/auth-guards'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockSupports, getMockOrders, type MockOrderRecord } from '@/lib/mock/mock-member-data'
import { getCurrentMockOrders } from '@/lib/mock/mock-order-history-server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentIsoDate } from '@/lib/date-utils'
import { ContributionsShell } from './_features/contributions-shell'
import { ActivityList } from './_features/activity-list'

type SupportProject = {
  name_default: string | null
  slug: string | null
  status: string | null
  cover_image_url?: string | null
}

type NormalizedSupport = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: SupportProject | null
  type: 'support'
}

type NormalizedContribution = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: SupportProject | null
  type: 'contribution'
}

type NormalizedOrder = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  product: {
    name_default: string | null
    slug: string | null
    cover_image_url?: string | null
  } | null
  type: 'order'
}

const normalizeProject = (raw: unknown): SupportProject | null => {
  const source = Array.isArray(raw) ? raw[0] : raw
  if (!source || typeof source !== 'object') return null
  const record = source as Record<string, unknown>
  return {
    name_default: typeof record.name_default === 'string' ? record.name_default : null,
    slug: typeof record.slug === 'string' ? record.slug : null,
    status: typeof record.status === 'string' ? record.status : null,
    cover_image_url:
      typeof record.cover_image_url === 'string'
        ? record.cover_image_url
        : typeof record.hero_image_url === 'string'
          ? record.hero_image_url
          : null,
  }
}

export default async function ContributionsPage() {
  const user = await requireAuth()
  const rawSupports = isMockDataSource
    ? getMockSupports(user.id)
    : (
        await (await createClient())
          .from('investments')
          .select(`
            id,
            amount_eur_equivalent,
            amount_points,
            returns_received_points,
            status,
            created_at,
            project:public_projects!project_id(
              name_default,
              slug,
              status,
              hero_image_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ).data || []

  const userSupports: NormalizedSupport[] = (rawSupports || []).map((inv) => ({
    id: String(inv.id),
    amount_eur: Number(inv.amount_eur_equivalent || 0),
    amount_points: Number(inv.amount_points || 0),
    status: String(inv.status || 'pending'),
    created_at: String(inv.created_at || getCurrentIsoDate()),
    project: normalizeProject(inv.project),
    type: 'support',
  }))

  // Fetch donations
  const rawDonations = isMockDataSource
    ? []
    : (
        await (await createClient())
          .from('donations')
          .select(`
            id,
            amount_eur_equivalent,
            amount_points,
            status,
            created_at,
            project:public_projects!project_id(
              name_default,
              slug,
              status,
              hero_image_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ).data || []

  const userDonations: NormalizedContribution[] = (rawDonations || []).map((don) => ({
    id: String(don.id),
    amount_eur: Number(don.amount_eur_equivalent || 0),
    amount_points: Number(don.amount_points || 0),
    status: String(don.status || 'pending'),
    created_at: String(don.created_at || getCurrentIsoDate()),
    project: normalizeProject(don.project),
    type: 'contribution',
  }))

  // Fetch orders
  const rawOrders = isMockDataSource
    ? await getCurrentMockOrders(user.id)
    : (
        await (await createClient())
          .from('orders')
          .select(`
            id,
            total_points,
            status,
            created_at,
            items:order_items(
              product_snapshot
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ).data || []

  const userOrders: NormalizedOrder[] = (rawOrders || []).map((order) => {
    const firstItem = Array.isArray(order.items) ? order.items[0] : null
    const productSnapshot = firstItem?.product_snapshot
    const totalEuros = typeof (order as Record<string, unknown>).total_euros === 'number' ? (order as Record<string, unknown>).total_euros as number : 0
    return {
      id: String(order.id),
      amount_eur: totalEuros,
      amount_points: Number(order.total_points || 0),
      status: String(order.status || 'pending'),
      created_at: String(order.created_at || getCurrentIsoDate()),
      product: productSnapshot
        ? {
            name_default: typeof productSnapshot.name === 'string' ? productSnapshot.name : null,
            slug: null,
            cover_image_url:
              typeof productSnapshot.cover_image_url === 'string' ? productSnapshot.cover_image_url : null,
          }
        : null,
      type: 'order',
    }
  })

  const totalSupported = [...userSupports, ...userDonations].reduce((sum, item) => sum + item.amount_eur, 0)
  const totalPoints = [...userSupports, ...userDonations, ...userOrders].reduce((sum, item) => sum + item.amount_points, 0)

  return (
    <ContributionsShell title="Historique">
      <ActivityList
        userSupports={userSupports}
        userDonations={userDonations}
        userOrders={userOrders}
        totalSupported={totalSupported}
        totalPoints={totalPoints}
      />
    </ContributionsShell>
  )
}
