import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/static'

export type GetProjectsOptions = {
    status?: string
    search?: string
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
            projectsQuery = projectsQuery.eq('status', status)
        }

        if (search) {
            projectsQuery = projectsQuery.ilike('name_default', `%${search}%`)
        }

        const { data, error } = await projectsQuery

        if (error) {
            console.error('[projects] fetch failed', error)
            throw error
        }

        // Force cast to any to bypass the complex relation typing issue which is correct at runtime
        return (data || []) as any[]
    },
    ['projects-list'],
    {
        revalidate: 3600, // 1 hour fallback
        tags: ['projects-list'],
    }
)
