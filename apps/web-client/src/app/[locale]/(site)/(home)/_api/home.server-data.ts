import 'server-only'
import type { QueryData, User } from '@supabase/supabase-js'
import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'
import type { ProductCardProduct } from '@/app/[locale]/(screens)/products/_features/product-card'
import type {
  DataState,
  HomeFeaturedProject,
  HomePartnerProducer,
} from '@/app/[locale]/(site)/(home)/_types/home.types'
import { getBlogPosts } from '@/app/[locale]/(site)/blog/_features/blog-data'
import type { BlogPost } from '@/app/[locale]/(site)/blog/_features/blog-types'
import { getMockProjects } from '@/app/[locale]/(tabs)/projects/_features/mock-projects'
// import { getPageContent } from '@/app/[locale]/admin/cms/_features/cms.service' // CMS deleted
import { sanitizeImageUrl } from '@/lib/image-url'
import { isMockDataSource } from '@/lib/mock/data-source'
import { createClient } from '@/lib/supabase/server'
import { isRecord } from '@/lib/type-guards'

type AsyncResult<T> = {
  data: T | null
  error: unknown
}

type HomeContent = Record<string, unknown> // CMS deleted - using fallback content

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

async function toAsyncResult<T>(promise: Promise<T>): Promise<AsyncResult<T>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

function toCountState(count: number | null, error: unknown): DataState<number> {
  if (error) {
    return { status: 'unknown', error }
  }

  if (typeof count !== 'number' || Number.isNaN(count)) {
    return { status: 'unknown' }
  }

  return { status: 'ready', value: count }
}

function toRpcNumberState(value: number | bigint | null, error: unknown): DataState<number> {
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

function toArrayState<T>(data: T[] | null, error: unknown): DataState<T[]> {
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

function mapReadyState<TRaw, TNormalized>(
  state: DataState<TRaw[]>,
  mapper: (row: TRaw) => TNormalized,
): DataState<TNormalized[]> {
  if (state.status !== 'ready') {
    return state
  }

  return {
    status: 'ready',
    value: state.value.map(mapper),
  }
}

function logUnknownState(label: string, state: DataState<unknown>) {
  if (state.status === 'unknown') {
    console.error('[home][unknown_state]', { label, error: state.error ?? null })
  }
}

function toLocalizedRecord(value: unknown): Record<string, string> | null {
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
      'id,slug,type,name_default,name_i18n,description_default,description_i18n,hero_image_url,target_budget,current_funding,address_city,address_country_code,status,featured',
    )
    .eq('featured', true)
    .limit(3)
    .order('created_at', { ascending: false })

  const activeProducersQuery = supabase
    .schema('investment')
    .from('producers')
    .select('id,name_default,description_default,contact_website,images')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const homeContentPromise = toAsyncResult(
    // CMS deleted - using fallback content directly
    (async () => {
      return {
        hero: {
          badge: 'Welcome',
          title: 'Make the Change',
          subtitle: 'Building a sustainable future together',
          cta_primary: 'Get Started',
          cta_secondary: 'Learn More',
        },
        stats: {
          projects: 'Active Projects',
          members: 'Community Members',
          global_impact: 'Global Impact',
          points_generated: 'Points Generated',
          points_label: 'Points',
        },
        universe: {
          title: 'Our Universe',
          description: 'Explore our ecosystem of change',
          cards: {
            projects: {
              title: 'Projects',
              description: 'Support impactful initiatives',
              cta: 'Explore Projects',
            },
            products: {
              title: 'Products',
              description: 'Ethical and sustainable choices',
              cta: 'Shop Products',
            },
            community: {
              title: 'Community',
              description: 'Join like-minded changemakers',
              cta: 'Join Community',
            },
          },
        },
        features: {
          title: 'Features',
          invest: {
            title: 'Invest',
            description: 'Put your money where it matters',
          },
          earn: {
            title: 'Earn',
            description: 'Get rewarded for your impact',
          },
          redeem: {
            title: 'Redeem',
            description: 'Turn points into real rewards',
          },
          explore: 'Explore Opportunities',
        },
        cta: {
          title: 'Ready to Make a Difference?',
          description: 'Join our community of changemakers',
          button: 'Get Started Now',
          stats: {
            engagement: 'Engaged Community',
            transparency: 'Full Transparency',
            community: 'Growing Community',
          },
        },
      }
    })(),
  )
  const pointsGeneratedQuery = supabase.rpc('get_total_points_generated')
  const latestPostsPromise = toAsyncResult(getBlogPosts())

  type FeaturedProjectRow = QueryData<typeof featuredProjectsQuery>[number]
  type ActiveProducerRow = QueryData<typeof activeProducersQuery>[number]

  const [
    authResult,
    activeProjectsResult,
    activeProductsResult,
    membersCountResult,
    featuredProjectsResult,
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
    activeProducersQuery,
    homeContentPromise,
    pointsGeneratedQuery,
    latestPostsPromise,
  ] as const)

  const activeProjectsState = toCountState(activeProjectsResult.count, activeProjectsResult.error)
  const activeProductsState = toCountState(activeProductsResult.count, activeProductsResult.error)
  const membersCountState = toRpcNumberState(membersCountResult.data, membersCountResult.error)
  const pointsGeneratedState = toRpcNumberState(pointsResult.data, pointsResult.error)

  const mockFeaturedProjects: HomeFeaturedProject[] = getMockProjects()
    .filter((p) => p.featured)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      type: p.type,
      name_default: p.name_default,
      name_i18n: p.name_i18n ?? null,
      description_default: p.description_default,
      description_i18n: p.description_i18n ?? null,
      hero_image_url: p.hero_image_url,
      target_budget: p.target_budget,
      current_funding: p.current_funding,
      address_city: p.address_city,
      address_country_code: p.address_country_code,
      status: p.status,
      featured: p.featured,
    }))

  let featuredProjectsState: DataState<HomeFeaturedProject[]>

  if (isMockDataSource) {
    featuredProjectsState = toArrayState(mockFeaturedProjects, null)
  } else {
    const dbState = mapReadyState(
      toArrayState<FeaturedProjectRow>(featuredProjectsResult.data, featuredProjectsResult.error),
      (project): HomeFeaturedProject => ({
        id: project.id,
        slug: project.slug,
        type: project.type,
        name_default: project.name_default,
        name_i18n: toLocalizedRecord(project.name_i18n),
        description_default: project.description_default,
        description_i18n: toLocalizedRecord(project.description_i18n),
        hero_image_url: sanitizeImageUrl(project.hero_image_url),
        target_budget: project.target_budget,
        current_funding: project.current_funding,
        address_city: project.address_city,
        address_country_code: project.address_country_code,
        status: project.status,
        featured: project.featured,
      }),
    )

    if (dbState.status === 'ready') {
      const mockSlugs = new Set(mockFeaturedProjects.map((p) => p.slug))
      const dedupedDb = dbState.value.filter((p) => !mockSlugs.has(p.slug))
      featuredProjectsState = toArrayState([...mockFeaturedProjects, ...dedupedDb], null)
    } else {
      featuredProjectsState =
        mockFeaturedProjects.length > 0 ? toArrayState(mockFeaturedProjects, null) : dbState
    }
  }

  const mockFeaturedProducts: ProductCardProduct[] = getMockProducts()
    .filter((p) => p.featured)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name_default: p.name_default,
      name_i18n: p.name_i18n ?? null,
      short_description_default: p.short_description_default ?? null,
      short_description_i18n: p.short_description_i18n ?? null,
      price_eur_equivalent: p.price_eur_equivalent,
      stock_quantity: p.stock_quantity,
      featured: p.featured,
      fulfillment_method: p.fulfillment_method,
      metadata: null,
      images: p.images,
      tags: p.tags,
    }))

  const featuredProductsState = toArrayState(mockFeaturedProducts, null)

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
