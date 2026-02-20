import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

type PublicProducerRow = {
  id: string
  name_default: string | null
  status: string | null
  created_at: string
}

const toPublicProducerRow = (value: unknown): PublicProducerRow | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const createdAt = asString(value.created_at)

  if (!id || !createdAt) {
    return null
  }

  return {
    id,
    name_default: asString(value.name_default) || null,
    status: asString(value.status) || null,
    created_at: createdAt,
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('public_producers')
      .select('id, name_default, status, created_at')
      .order('name_default', { ascending: true })

    const producerRows = Array.isArray(data)
      ? data
          .map((entry) => toPublicProducerRow(entry))
          .filter((entry): entry is PublicProducerRow => entry !== null)
      : []

    const partners = producerRows.map((p) => ({
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
