import { db } from '@make-the-change/core/db'
import { producers } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'
import { partnerFormSchema } from '@/lib/validators/partner'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const [partner] = await db.select().from(producers).where(eq(producers.id, id)).limit(1)

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: partner.id,
      name: partner.name_default,
      slug: partner.slug,
      description: partner.description_default || '',
      contact_website: partner.contact_website || '',
      contact_email: partner.contact_email || '',
      status: partner.status || 'pending',
      created_at: partner.created_at,
    })
  } catch (error) {
    console.error('Partner detail error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const body = await request.json()
    const parsed = partnerFormSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const payload = parsed.data
    const updatePayload: Record<string, unknown> = {}

    if (payload.name !== undefined) updatePayload.name_default = payload.name
    if (payload.slug !== undefined) updatePayload.slug = payload.slug
    if (payload.description !== undefined)
      updatePayload.description_default = payload.description || null
    if (payload.contact_website !== undefined)
      updatePayload.contact_website = payload.contact_website || null
    if (payload.contact_email !== undefined)
      updatePayload.contact_email = payload.contact_email || null
    if (payload.status !== undefined) updatePayload.status = payload.status

    const [partner] = await db
      .update(producers)
      .set(updatePayload)
      .where(eq(producers.id, id))
      .returning()

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: partner.id,
      name: partner.name_default,
      slug: partner.slug,
      description: partner.description_default || '',
      contact_website: partner.contact_website || '',
      contact_email: partner.contact_email || '',
      status: partner.status || 'pending',
      created_at: partner.created_at,
    })
  } catch (error) {
    console.error('Partner update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
