import 'server-only'
import type { QueryData, User } from '@supabase/supabase-js'
import { getBlogPosts } from '@/app/[locale]/(marketing)/blog/_features/blog-data'
import type { BlogPost } from '@/app/[locale]/(marketing)/blog/_features/blog-types'
import type { ProductCardProduct } from '@/app/[locale]/(marketing)/products/_features/product-card'
import { getPageContent } from '@/app/[locale]/admin/cms/_features/cms.service'
import { sanitizeImageUrl } from '@/lib/image-url'
import { createClient } from '@/lib/supabase/server'
import { isRecord } from '@/lib/type-guards'
import type { DataState, HomeFeaturedProject, HomePartnerProducer } from './home.types'

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

const mapReadyState = <TRaw, TNormalized>(
  state: DataState<TRaw[]>,
  mapper: (row: TRaw) => TNormalized,
): DataState<TNormalized[]> => {
  if (state.status !== 'ready') {
    return state
  }

  return {
    status: 'ready',
    value: state.value.map(mapper),
  }
}

const logUnknownState = (label: string, state: DataState<unknown>) => {
  if (state.status === 'unknown') {
    console.error('[home][unknown_state]', { label, error: state.error ?? null })
  }
}

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
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
      'id,slug,name_default,name_i18n,description_default,description_i18n,hero_image_url,target_budget,current_funding,status,featured',
    )
    .eq('featured', true)
    .limit(3)
    .order('created_at', { ascending: false })

  const featuredProductsQuery = supabase
    .schema('commerce')
    .from('products')
    .select(
      'id,slug,name_default,name_i18n,short_description_default,short_description_i18n,price_points,price_eur_equivalent,stock_quantity,featured,fulfillment_method,metadata,images,tags',
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

  const homeContentPromise = toAsyncResult(
  getPageContent('home').catch(async (error) => {
    console.warn('[home] Failed to fetch page content, using fallback:', error)
    // Return minimal fallback content to prevent crashes
    return {
      hero: {
        badge: 'Welcome',
        title: 'Make the Change',
        subtitle: 'Building a sustainable future together',
        cta_primary: 'Get Started',
        cta_secondary: 'Learn More'
      },
      stats: {
        projects: 'Active Projects',
        members: 'Community Members',
        global_impact: 'Global Impact',
        points_generated: 'Points Generated',
        points_label: 'Points'
      },
      universe: {
        title: 'Our Universe',
        description: 'Explore our ecosystem of change',
        cards: {
          projects: {
            title: 'Projects',
            description: 'Support impactful initiatives',
            cta: 'Explore Projects'
          },
          products: {
            title: 'Products',
            description: 'Ethical and sustainable choices',
            cta: 'Shop Products'
          },
          community: {
            title: 'Community',
            description: 'Join like-minded changemakers',
            cta: 'Join Community'
          }
        }
      },
      features: {
        title: 'Features',
        invest: {
          title: 'Invest',
          description: 'Put your money where it matters'
        },
        earn: {
          title: 'Earn',
          description: 'Get rewarded for your impact'
        },
        redeem: {
          title: 'Redeem',
          description: 'Turn points into real rewards'
        },
        explore: 'Explore Opportunities'
      },
      cta: {
        title: 'Ready to Make a Difference?',
        description: 'Join our community of changemakers',
        button: 'Get Started Now',
        stats: {
          engagement: 'Engaged Community',
          transparency: 'Full Transparency',
          community: 'Growing Community'
        }
      }
    }
  })
)
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

  const featuredProjectsState = mapReadyState(
    toArrayState<FeaturedProjectRow>(featuredProjectsResult.data, featuredProjectsResult.error),
    (project): HomeFeaturedProject => ({
      id: project.id,
      slug: project.slug,
      name_default: project.name_default,
      name_i18n: toLocalizedRecord(project.name_i18n),
      description_default: project.description_default,
      description_i18n: toLocalizedRecord(project.description_i18n),
      hero_image_url: sanitizeImageUrl(project.hero_image_url),
      target_budget: project.target_budget,
      current_funding: project.current_funding,
      status: project.status,
      featured: project.featured,
    }),
  )

  const featuredProductsState = mapReadyState(
    toArrayState<FeaturedProductRow>(featuredProductsResult.data, featuredProductsResult.error),
    (product): ProductCardProduct => ({
      id: product.id,
      slug: product.slug,
      name_default: product.name_default,
      name_i18n: toLocalizedRecord(product.name_i18n),
      short_description_default: product.short_description_default,
      short_description_i18n: toLocalizedRecord(product.short_description_i18n),
      price_points: product.price_points,
      price_eur_equivalent: product.price_eur_equivalent,
      stock_quantity: product.stock_quantity,
      featured: product.featured,
      fulfillment_method: product.fulfillment_method,
      metadata: product.metadata,
      images: product.images ?? [],
      tags: product.tags ?? [],
    }),
  )

  const activeProducersState = mapReadyState(
    toArrayState<ActiveProducerRow>(activeProducersResult.data, activeProducersResult.error),
    (producer): HomePartnerProducer => ({
      id: producer.id,
      name_default: producer.name_default,
      description_default: producer.description_default ?? '',
      contact_website: producer.contact_website ?? undefined,
      images: producer.images ?? [],
    }),
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
