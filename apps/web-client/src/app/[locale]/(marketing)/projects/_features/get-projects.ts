import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/static'

export type GetProjectsOptions = {
  status?: string
  search?: string
}

type ProjectStatusFilter = 'active' | 'completed' | 'archived' | 'draft' | 'funded'

type ProjectListItem = {
  id: string | null
  slug: string | null
  name_default: string | null
  description_default: string | null
  target_budget: number | null
  current_funding: number | null
  funding_progress: number | null
  address_city: string | null
  address_country_code: string | null
  featured: boolean | null
  launch_date: string | null
  status: string | null
  hero_image_url: string | null
  type: string | null
  producer?: { name_default?: string | null } | Record<string, unknown> | null
}

export const getProjects = unstable_cache(
  async (options: GetProjectsOptions = {}) => {
    const supabase = createStaticClient()
    const { status = 'all', search } = options

    // Build query
    let projectsQuery = supabase
      .from('public_projects')
      .select(`
        *,
        producer:public_producers!producer_id(*)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status !== 'all') {
      projectsQuery = projectsQuery.eq('status', status as ProjectStatusFilter)
    }

    if (search) {
      projectsQuery = projectsQuery.ilike('name_default', `%${search}%`)
    }

    const { data, error } = await projectsQuery

    if (error) {
      console.error('[projects] fetch failed', error)
      throw error
    }

    return Array.isArray(data) ? (data as ProjectListItem[]) : []
  },
  ['projects-list'],
  {
    revalidate: 3600, // 1 hour fallback
    tags: ['projects-list'],
  },
)
