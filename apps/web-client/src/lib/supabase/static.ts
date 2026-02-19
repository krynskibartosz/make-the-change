import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a static Supabase client for public data fetching.
 * This client does NOT access request cookies, making it safe for
 * static usage and caching (e.g. `unstable_cache`).
 *
 * Use this only for public data that doesn't require RLS policies
 * based on `auth.uid()`.
 */
export const createStaticClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
