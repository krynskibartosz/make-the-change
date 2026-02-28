import 'server-only'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asBoolean, asStringArray, isRecord } from '@/lib/type-guards'

/**
 * Requires an authenticated user.
 * Throws an error if not authenticated - use in layouts with try/catch.
 * Logs security events with IP address.
 */
export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Unauthorized Access Attempt | IP: ${ip}`)
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Requires an authenticated user and redirects to login if not.
 * Use this in layouts for automatic redirect handling.
 */
export async function requireAuthWithRedirect() {
  try {
    return await requireAuth()
  } catch {
    const locale = await getLocale()
    redirect({ href: '/login', locale })
  }
}

/**
 * Gets the current user without throwing.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

type AdminPermissions = {
  canAccessAdmin: boolean
  isAdmin: boolean
  isSuperadmin: boolean
  roles: string[]
}

const toAdminPermissions = (value: unknown): AdminPermissions => {
  if (!isRecord(value)) {
    return {
      canAccessAdmin: false,
      isAdmin: false,
      isSuperadmin: false,
      roles: [],
    }
  }

  return {
    canAccessAdmin: asBoolean(value.can_access_admin),
    isAdmin: asBoolean(value.is_admin),
    isSuperadmin: asBoolean(value.is_superadmin),
    roles: asStringArray(value.roles),
  }
}

export async function requireAdmin() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('check_user_permissions', {
    p_user_id: user.id,
  })

  if (error) {
    console.error('[SECURITY] Failed to resolve admin permissions', error)
    throw new Error('Forbidden')
  }

  const permissionRow = Array.isArray(data) ? data[0] : null
  const permissions = toAdminPermissions(permissionRow)

  if (!permissions.canAccessAdmin && !permissions.isAdmin && !permissions.isSuperadmin) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    console.warn(`[SECURITY] Forbidden Admin Access | User: ${user.id} | IP: ${ip}`)
    throw new Error('Forbidden')
  }

  return { user, permissions }
}

export async function requireAdminWithRedirect() {
  try {
    return await requireAdmin()
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      const locale = await getLocale()
      redirect({ href: '/login', locale })
    }

    notFound()
  }
}
