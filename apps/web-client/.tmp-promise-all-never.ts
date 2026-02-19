import type { Database } from '@make-the-change/core/database-types'
import type { PostgrestSingleResponse, QueryData, SupabaseClient } from '@supabase/supabase-js'

declare const supabase: SupabaseClient<Database>

type AsyncResult<T> = { data: T | null; error: unknown }
declare function toAsyncResult<T>(promise: Promise<T>): Promise<AsyncResult<T>>
declare function getPageContent(s: string): Promise<{ ok: true }>
declare function getBlogPosts(): Promise<{ slug: string }[]>

async function test() {
  const activeProjectsCountQuery = supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status','active')
  const activeProductsCountQuery = supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true)
  const membersCountQuery = supabase.rpc('count_total_members')

  const featuredProjectsQuery = supabase.from('projects').select('id,slug,name_default,description_default,hero_image_url,target_budget,current_funding,status,featured').eq('featured',true).limit(3).order('created_at', { ascending: false })

  const featuredProductsQuery = supabase.from('products').select('id,slug,name_default,short_description_default,price_points,price_eur_equivalent,stock_quantity,featured,fulfillment_method,metadata,images,tags').eq('featured',true).limit(4).order('created_at', { ascending: false })

  const activeProducersQuery = supabase.from('producers').select('id,name_default,description_default,contact_website,images').eq('status','active').order('created_at', { ascending: false })

  const pointsGeneratedQuery = supabase.rpc('get_total_points_generated')

  type FeaturedProductRow = QueryData<typeof featuredProductsQuery>[number]
  let _x!: FeaturedProductRow
  _x.id

  const [
    activeProjectsResult,
    activeProductsResult,
    membersCountResult,
    featuredProjectsResult,
    featuredProductsResult,
    activeProducersResult,
    homeContent,
    pointsResult,
    latestPosts,
  ] = await Promise.all([
    activeProjectsCountQuery,
    activeProductsCountQuery,
    membersCountQuery,
    featuredProjectsQuery,
    featuredProductsQuery,
    activeProducersQuery,
    toAsyncResult(getPageContent('home')),
    pointsGeneratedQuery,
    toAsyncResult(getBlogPosts()),
  ])

  featuredProductsResult.data?.map((el) => el.id)
  featuredProjectsResult.data?.map((el) => el.id)

  const _assert1: PostgrestSingleResponse<never[]> = featuredProductsResult
  return {
    activeProjectsResult,
    activeProductsResult,
    membersCountResult,
    featuredProjectsResult,
    featuredProductsResult,
    activeProducersResult,
    homeContent,
    pointsResult,
    latestPosts,
  }
}
