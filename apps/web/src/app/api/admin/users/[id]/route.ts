import { db } from '@make-the-change/core/db'
import { profiles } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

const updateSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  user_level: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
  kyc_status: z.enum(['pending', 'light', 'complete', 'rejected']).optional(),
  address_country_code: z.string().length(2).optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const [user] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const body = await request.json()
    const validData = updateSchema.parse(body)

    const updatePayload: Record<string, unknown> = {}
    if (validData.email !== undefined) updatePayload.email = validData.email
    if (validData.first_name !== undefined) updatePayload.first_name = validData.first_name
    if (validData.last_name !== undefined) updatePayload.last_name = validData.last_name
    if (validData.user_level !== undefined) updatePayload.user_level = validData.user_level
    if (validData.kyc_status !== undefined) updatePayload.kyc_status = validData.kyc_status
    if (validData.address_country_code !== undefined)
      updatePayload.address_country_code = validData.address_country_code
    updatePayload.updated_at = new Date()

    const [updated] = await db
      .update(profiles)
      .set(updatePayload)
      .where(eq(profiles.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
