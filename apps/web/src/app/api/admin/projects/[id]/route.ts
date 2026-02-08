import { db } from '@make-the-change/core/db'
import { projects } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'
import { projectBaseSchema } from '@/lib/validators/project'

const updateSchema = projectBaseSchema.partial()

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const { id } = await params
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
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
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const payload = parsed.data
    const updatePayload: Record<string, unknown> = {}

    if (payload.name !== undefined) updatePayload.name_default = payload.name
    if (payload.description !== undefined)
      updatePayload.description_default = payload.description || null
    if (payload.long_description !== undefined)
      updatePayload.long_description_default = payload.long_description || null
    if (payload.images !== undefined) updatePayload.gallery_image_urls = payload.images || []
    if (payload.slug !== undefined) updatePayload.slug = payload.slug
    if (payload.type !== undefined) updatePayload.type = payload.type
    if (payload.target_budget !== undefined) updatePayload.target_budget = payload.target_budget
    if (payload.producer_id !== undefined) updatePayload.producer_id = payload.producer_id
    if (payload.status !== undefined) updatePayload.status = payload.status
    if (payload.featured !== undefined) updatePayload.featured = payload.featured

    const [updated] = await db
      .update(projects)
      .set(updatePayload)
      .where(eq(projects.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
