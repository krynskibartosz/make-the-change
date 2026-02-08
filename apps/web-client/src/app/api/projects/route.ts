import { createClient } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '24')

    let query = supabase
      .from('public_projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.ilike('name_default', `%${search}%`)
    }

    if (featured !== null) {
      query = query.eq('featured', featured === 'true')
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Projects API error:', error)
      return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return Response.json({
      items: data || [],
      nextCursor: null,
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
