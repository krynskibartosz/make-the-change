import { createClient } from '@supabase/supabase-js'
import { getEnv, requireEnv } from './env'

type SeedProject = {
  id: string
  slug: string | null
  name_default?: string | null
}

type SeedProducer = {
  id: string
  name?: string | null
  slug?: string | null
}

type SeedProduct = {
  id: string
  slug: string | null
  name_default?: string | null
  price_points?: number | null
  stock_quantity?: number | null
}

export const getSupabaseAnon = () => {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const getSupabaseAdmin = () => {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const fetchSeedProject = async (): Promise<SeedProject | null> => {
  const supabase = getSupabaseAnon()
  const { data, error } = await supabase
    .from('public_projects')
    .select('id, slug, name_default')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(`Failed to load public_projects: ${error.message}`)
  }

  return data?.[0] ?? null
}

export const fetchSeedProduct = async (): Promise<SeedProduct | null> => {
  const supabase = getSupabaseAnon()
  const { data, error } = await supabase
    .from('public_products')
    .select('id, slug, name_default, price_points, stock_quantity')
    .or('stock_quantity.is.null,stock_quantity.gt.0')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(`Failed to load public_products: ${error.message}`)
  }

  return data?.[0] ?? null
}

export const fetchSeedProducer = async (): Promise<SeedProducer | null> => {
  const supabase = getSupabaseAnon()
  const { data, error } = await supabase
    .from('public_producers')
    .select('id, name, slug')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(`Failed to load public_producers: ${error.message}`)
  }

  return data?.[0] ?? null
}

type EnsurePointsResult =
  | { ok: true; updated: boolean; points: number }
  | { ok: false; reason: string }

export const ensureUserHasPoints = async (
  email: string,
  minPoints: number,
): Promise<EnsurePointsResult> => {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, reason: 'SUPABASE_SERVICE_ROLE_KEY missing' }
  }

  const { data: userData, error: userError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (userError) {
    return { ok: false, reason: userError.message }
  }

  const normalizedEmail = email.trim().toLowerCase()
  const users = userData?.users ?? []
  const user = users.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail)

  if (!user) {
    return { ok: false, reason: 'User not found' }
  }

  const userId = user.id
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('metadata')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    return { ok: false, reason: profileError.message }
  }

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const current = Number(metadata.points_balance ?? 0)

  if (current >= minPoints) {
    return { ok: true, updated: false, points: current }
  }

  const delta = minPoints - current
  const { error: creditError } = await admin.schema('commerce').rpc('add_points', {
    p_user_id: userId,
    p_delta: delta,
    p_reason: 'e2e_seed',
    p_metadata: { source: 'e2e' },
  })

  if (creditError) {
    return { ok: false, reason: creditError.message }
  }

  return { ok: true, updated: true, points: minPoints }
}
