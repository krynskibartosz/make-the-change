import { NextResponse } from 'next/server'

import { AuthError, requireAdmin } from '@/lib/auth-guards'

export async function requireAdminOrResponse() {
  try {
    await requireAdmin()
    return null
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 401
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }
}
