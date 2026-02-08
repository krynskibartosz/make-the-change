import 'server-only'

import { db } from '@make-the-change/core/db'
import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import { producers, userRoles } from '@make-the-change/core/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createSupabaseServer } from '@/supabase/server'

const getAllowlist = () =>
  (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

export class AuthError extends Error {
  status: 401 | 403

  constructor(message: string, status: 401 | 403) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

const normalizeLocale = (value: string | undefined): Locale => {
  if (value && isLocale(value)) return value
  return defaultLocale
}

const getLoginPath = (locale: Locale) => `/${locale}/admin/login`
const getPartnerDashboardPath = (locale: Locale) => `/${locale}/partner/dashboard`
const getAdminDashboardPath = (locale: Locale) => `/${locale}/admin/dashboard`

const isEmailAllowlisted = (email: string | null | undefined) => {
  const allowlist = getAllowlist()
  const normalized = (email || '').toLowerCase()
  return allowlist.length === 0 || allowlist.includes(normalized)
}

const getAuthUser = cache(async () => {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
})

const getActiveRoles = cache(async (userId: string) => {
  const rows = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.user_id, userId),
        isNull(userRoles.revoked_at),
        isNull(userRoles.deleted_at),
      ),
    )

  return rows.map((r) => r.role)
})

export async function requireAdmin() {
  const user = await getAuthUser()
  if (!user) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Unauthorized Admin Access Attempt: Anon | IP: ${ip}`)
    throw new AuthError('Unauthorized', 401)
  }

  if (!isEmailAllowlisted(user.email)) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Admin Allowlist Rejected: ${user.email} | IP: ${ip}`)
    throw new AuthError('Forbidden', 403)
  }

  const roles = await getActiveRoles(user.id)
  const adminRoles = ['admin', 'superadmin']
  const hasAccess = roles.some((r) => adminRoles.includes(r))

  if (!hasAccess) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Admin Role Required: ${user.email} | IP: ${ip}`)
    throw new AuthError('Forbidden', 403)
  }

  return user
}

export async function requireAdminPage(locale?: string) {
  const loc = normalizeLocale(locale)
  const user = await getAuthUser()
  if (!user) redirect(getLoginPath(loc))

  const roles = await getActiveRoles(user.id)

  const adminRoles = ['admin', 'superadmin']
  const isAdmin = roles.some((r) => adminRoles.includes(r))
  const allowlisted = isEmailAllowlisted(user.email)

  if (isAdmin && allowlisted) return user

  if (roles.includes('producer')) {
    redirect(getPartnerDashboardPath(loc))
  }

  redirect(getLoginPath(loc))
}

export async function requireProducer() {
  const user = await getAuthUser()
  if (!user) throw new AuthError('Unauthorized', 401)

  const roles = await getActiveRoles(user.id)
  const validRoles = ['producer', 'admin', 'superadmin']
  const hasAccess = roles.some((r) => validRoles.includes(r))

  if (!hasAccess) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Unauthorized Partner Access: ${user.email} | IP: ${ip}`)
    throw new AuthError('Forbidden', 403)
  }

  // Get producer profile linked to user
  const [producer] = await db
    .select({
      id: producers.id,
      name: producers.name_default,
      status: producers.status,
    })
    .from(producers)
    .where(eq(producers.owner_user_id, user.id))
    .limit(1)

  return { user, producer }
}

export async function requireProducerOrAdminPage(locale?: string) {
  const loc = normalizeLocale(locale)
  const user = await getAuthUser()
  if (!user) redirect(getLoginPath(loc))

  const roles = await getActiveRoles(user.id)
  const isProducer = roles.includes('producer')
  const isAdmin = roles.includes('admin') || roles.includes('superadmin')

  if (isProducer) return user
  if (isAdmin) redirect(getAdminDashboardPath(loc))

  redirect(getLoginPath(loc))
}
