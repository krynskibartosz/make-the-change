import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('public_producers')
      .select('id, name_default, status, created_at')
      .order('name_default', { ascending: true })

    const partners = (data || []).map((p) => ({
      id: p.id,
      name: p.name_default || 'Unknown',
      // contact_email removed for security - contact should go through authenticated messaging
      status: p.status || 'pending',
      created_at: p.created_at,
    }))

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners for mobile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
