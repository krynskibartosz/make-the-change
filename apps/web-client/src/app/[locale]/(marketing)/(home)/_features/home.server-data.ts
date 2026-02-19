import 'server-only'
import type { QueryData, User } from '@supabase/supabase-js'
import { getBlogPosts } from '@/app/[locale]/(marketing)/blog/_features/blog-data'
import type { BlogPost } from '@/app/[locale]/(marketing)/blog/_features/blog-types'
import type { ProductCardProduct } from '@/app/[locale]/(marketing)/products/_features/product-card'
import { getPageContent } from '@/app/[locale]/admin/cms/_features/cms.service'
import { sanitizeImageUrl } from '@/lib/image-url'
import { createClient } from '@/lib/supabase/server'
import type {
  DataState,
  HomeActiveProducerSource,
  HomeFeaturedProductSource,
  HomeFeaturedProject,
  HomeFeaturedProjectSource,
  HomePartnerProducer,
} from './home.types'

type AsyncResult<T> = {
  data: T | null
  error: unknown
}

type HomeContent = Awaited<ReturnType<typeof getPageContent>>

export type HomeServerData = {
  user: User | null
  homeContent: AsyncResult<HomeContent>
  activeProjectsState: DataState<number>
  activeProductsState: DataState<number>
  membersCountState: DataState<number>
  pointsGeneratedState: DataState<number>
  featuredProjectsState: DataState<HomeFeaturedProject[]>
  featuredProductsState: DataState<ProductCardProduct[]>
  activeProducersState: DataState<HomePartnerProducer[]>
  blogPostsState: DataState<BlogPost[]>
}

const toAsyncResult = async <T>(promise: Promise<T>): Promise<AsyncResult<T>> => {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

const toCountState = (count: number | null, error: unknown): DataState<number> => {
  if (error) {
    return { status: 'unknown', error }
  }

  if (typeof count !== 'number' || Number.isNaN(count)) {
    return { status: 'unknown' }
  }

  return { status: 'ready', value: count }
}

const toRpcNumberState = (value: number | bigint | null, error: unknown): DataState<number> => {
  if (error) {
    return { status: 'unknown', error }
  }

  if (value === null || value === undefined) {
    return { status: 'unknown' }
  }

  const numericValue = typeof value === 'bigint' ? Number(value) : value
  if (!Number.isFinite(numericValue)) {
    return { status: 'unknown' }
  }

  return { status: 'ready', value: numericValue }
}

const toArrayState = <T>(data: T[] | null, error: unknown): DataState<T[]> => {
  if (error) {
    return { status: 'unknown', error }
  }

  if (!Array.isArray(data)) {
    return { status: 'unknown' }
  }

  if (data.length === 0) {
    return { status: 'empty' }
  }

  return { status: 'ready', value: data }
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const toNullableNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const toNullableBoolean = (value: unknown): boolean | null =>
  typeof value === 'boolean' ? value : null

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is string => typeof entry === 'string')
}

const normalizeArrayState = <TRaw, TNormalized>(
  state: DataState<TRaw[]>,
  label: string,
  normalize: (row: TRaw) => TNormalized | null,
): DataState<TNormalized[]> => {
  if (state.status === 'unknown') {
    return state
  }

  if (state.status === 'empty') {
    return state
  }

  const normalized: TNormalized[] = []
  state.value.forEach((row, index) => {
    const value = normalize(row)
    if (value === null) {
      console.error('[home][dropped_row]', { label, index })
      return
    }

    normalized.push(value)
  })

  if (normalized.length === 0) {
    return { status: 'empty' }
  }

  return { status: 'ready', value: normalized }
}

const normalizeFeaturedProject = (
  project: HomeFeaturedProjectSource,
): HomeFeaturedProject | null => {
  if (!isNonEmptyString(project.id)) {
    return null
  }

  return {
    id: project.id,
    slug: isNonEmptyString(project.slug) ? project.slug : project.id,
    name_default: toNullableString(project.name_default),
    description_default: toNullableString(project.description_default),
    hero_image_url: sanitizeImageUrl(toNullableString(project.hero_image_url)),
    target_budget: toNullableNumber(project.target_budget),
    current_funding: toNullableNumber(project.current_funding),
    status: toNullableString(project.status),
    featured: toNullableBoolean(project.featured),
  }
}

const normalizeFeaturedProduct = (
  product: HomeFeaturedProductSource,
): ProductCardProduct | null => {
  if (!isNonEmptyString(product.id)) {
    return null
  }

  return {
    id: product.id,
    slug: toNullableString(product.slug),
    name_default: toNullableString(product.name_default),
    short_description_default: toNullableString(product.short_description_default),
    price_points: toNullableNumber(product.price_points),
    price_eur_equivalent: toNullableNumber(product.price_eur_equivalent),
    stock_quantity: toNullableNumber(product.stock_quantity),
    featured: toNullableBoolean(product.featured),
    fulfillment_method: toNullableString(product.fulfillment_method),
    metadata: product.metadata,
    images: product.images,
    tags: toStringArray(product.tags),
  }
}

const normalizeActiveProducer = (
  producer: HomeActiveProducerSource,
): HomePartnerProducer | null => {
  if (!isNonEmptyString(producer.id)) {
    return null
  }

  if (!isNonEmptyString(producer.name_default)) {
    return null
  }

  return {
    id: producer.id,
    name_default: producer.name_default,
    description_default: toNullableString(producer.description_default) ?? '',
    contact_website: toNullableString(producer.contact_website) ?? undefined,
    images: toStringArray(producer.images),
  }
}

const logUnknownState = (label: string, state: DataState<unknown>) => {
  if (state.status === 'unknown') {
    console.error('[home][unknown_state]', { label, error: state.error ?? null })
  }
}

export async function getHomeServerData(): Promise<HomeServerData> {
  const supabase = await createClient()

  const activeProjectsCountQuery = supabase
    .schema('investment')
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  const activeProductsCountQuery = supabase
    .schema('commerce')
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  const membersCountQuery = supabase.rpc('count_total_members')

  const featuredProjectsQuery = supabase
    .schema('investment')
    .from('projects')
    .select(
      'id,slug,name_default,description_default,hero_image_url,target_budget,current_funding,status,featured',
    )
    .eq('featured', true)
    .limit(3)
    .order('created_at', { ascending: false })

  const featuredProductsQuery = supabase
    .schema('commerce')
    .from('products')
    .select(
      'id,slug,name_default,short_description_default,price_points,price_eur_equivalent,stock_quantity,featured,fulfillment_method,metadata,images,tags',
    )
    .eq('featured', true)
    .limit(4)
    .order('created_at', { ascending: false })

  const activeProducersQuery = supabase
    .schema('investment')
    .from('producers')
    .select('id,name_default,description_default,contact_website,images')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const homeContentPromise = toAsyncResult(getPageContent('home'))
  const pointsGeneratedQuery = supabase.rpc('get_total_points_generated')
  const latestPostsPromise = toAsyncResult(getBlogPosts())

  type FeaturedProjectRow = QueryData<typeof featuredProjectsQuery>[number]
  type FeaturedProductRow = QueryData<typeof featuredProductsQuery>[number]
  type ActiveProducerRow = QueryData<typeof activeProducersQuery>[number]

  const [
    authResult,
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
    supabase.auth.getUser(),
    activeProjectsCountQuery,
    activeProductsCountQuery,
    membersCountQuery,
    featuredProjectsQuery,
    featuredProductsQuery,
    activeProducersQuery,
    homeContentPromise,
    pointsGeneratedQuery,
    latestPostsPromise,
  ] as const)

  const activeProjectsState = toCountState(activeProjectsResult.count, activeProjectsResult.error)
  const activeProductsState = toCountState(activeProductsResult.count, activeProductsResult.error)
  const membersCountState = toRpcNumberState(membersCountResult.data, membersCountResult.error)
  const pointsGeneratedState = toRpcNumberState(pointsResult.data, pointsResult.error)

  const featuredProjectsState = normalizeArrayState(
    toArrayState<FeaturedProjectRow>(featuredProjectsResult.data, featuredProjectsResult.error),
    'featured_project',
    normalizeFeaturedProject,
  )

  const featuredProductsState = normalizeArrayState(
    toArrayState<FeaturedProductRow>(featuredProductsResult.data, featuredProductsResult.error),
    'featured_product',
    normalizeFeaturedProduct,
  )

  const activeProducersState = normalizeArrayState(
    toArrayState<ActiveProducerRow>(activeProducersResult.data, activeProducersResult.error),
    'active_producer',
    normalizeActiveProducer,
  )

  const blogPostsState = toArrayState<BlogPost>(latestPosts.data, latestPosts.error)

  logUnknownState('active_projects_count', activeProjectsState)
  logUnknownState('active_products_count', activeProductsState)
  logUnknownState('members_count', membersCountState)
  logUnknownState('points_generated', pointsGeneratedState)
  logUnknownState('featured_projects', featuredProjectsState)
  logUnknownState('featured_products', featuredProductsState)
  logUnknownState('active_producers', activeProducersState)
  logUnknownState('blog_posts', blogPostsState)

  if (homeContent.error) {
    console.error('[home][unknown_state]', { label: 'cms_home_content', error: homeContent.error })
  }

  return {
    user: authResult.data.user,
    homeContent,
    activeProjectsState,
    activeProductsState,
    membersCountState,
    pointsGeneratedState,
    featuredProjectsState,
    featuredProductsState,
    activeProducersState,
    blogPostsState,
  }
}
