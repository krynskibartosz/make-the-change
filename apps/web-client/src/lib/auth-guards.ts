import 'server-only'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

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
