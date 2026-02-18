import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const ProductsQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  featured: z.enum(['true', 'false']).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('24'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = ProductsQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return Response.json({ error: 'Invalid query parameters' }, { status: 400 })
    }

    const { search, categoryId, featured, limit } = parsed.data
    const supabase = await createClient()

    let query = supabase
      .from('public_products' as any)
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.ilike('name_default', `%${search}%`)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('[api/products] query failed', error)
      return Response.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    return Response.json({ data: data || [], count: data?.length || 0 })
  } catch (error) {
    console.error('[api/products] unexpected error', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
