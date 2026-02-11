/**
 * Next.js Proxy (replaces middleware)
 * i18n + Supabase Auth + Session Refresh
 */

import { db } from '@make-the-change/core/db'
import { userRoles } from '@make-the-change/core/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { checkAuth } from '@/supabase/middleware'

import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

const getActiveRoles = async (userId: string) => {
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
}

const getAllowlist = () =>
  (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

const getLocaleFromPath = (pathname: string) => {
  const localeMatch = pathname.match(/^\/(fr|en|nl)/)
  return localeMatch ? localeMatch[1] : 'fr'
}

export const config = {
  matcher: [
    // Toutes les routes sauf API et assets
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Routes admin localisées
    '/(fr|en|nl)/admin/:path*',
    // API admin
    '/api/admin/:path*',
  ],
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // API admin guard (no i18n for API routes)
  if (pathname.startsWith('/api/admin')) {
    try {
      const { response, user, isAuthenticated } = await checkAuth(request)

      if (!isAuthenticated || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const roles = await getActiveRoles(user.id)
      const isAdmin = roles.includes('admin') || roles.includes('superadmin')
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const allowlist = getAllowlist()
      if (allowlist.length > 0 && !allowlist.includes((user.email || '').toLowerCase())) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return response
    } catch (error) {
      console.error('API admin auth error:', error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // 1. i18n routing first
  const i18nResponse = handleI18nRouting(request)

  if (i18nResponse.status === 307 || i18nResponse.status === 302) {
    return i18nResponse
  }

  // 2. Admin & Partner routes protection (with locale)
  const isAdminRoute = pathname.match(/^\/(fr|en|nl)\/admin/) || pathname.startsWith('/admin')
  const isPartnerRoute = pathname.match(/^\/(fr|en|nl)\/partner/) || pathname.startsWith('/partner')
  const isLoginRoute =
    pathname.match(/^\/(fr|en|nl)\/admin\/login/) || pathname.startsWith('/admin/login') ||
    pathname.match(/^\/(fr|en|nl)\/login/) || pathname.startsWith('/login')

  if ((isAdminRoute || isPartnerRoute) && !isLoginRoute) {
    try {
      const { response, user, isAuthenticated } = await checkAuth(request)

      if (!isAuthenticated || !user) {
        const locale = getLocaleFromPath(pathname)
        const loginUrl = new URL(isAdminRoute ? `/${locale}/admin/login` : `/${locale}/login`, request.url)
        const redirectTarget = pathname + request.nextUrl.search
        loginUrl.searchParams.set('redirect', redirectTarget)
        return NextResponse.redirect(loginUrl)
      }

      const roles = await getActiveRoles(user.id)
      const isAdmin = roles.includes('admin') || roles.includes('superadmin')
      const isProducer = roles.includes('producer')

      if (isAdminRoute && !isAdmin) {
        const locale = getLocaleFromPath(pathname)

        if (isProducer) {
          return NextResponse.redirect(new URL(`/${locale}/partner/dashboard`, request.url))
        }

        const loginUrl = new URL(`/${locale}/admin/login`, request.url)
        loginUrl.searchParams.set('denied', '1')
        return NextResponse.redirect(loginUrl)
      }

      if (isPartnerRoute && !isProducer && !isAdmin) {
        const locale = getLocaleFromPath(pathname)
        return NextResponse.redirect(new URL(`/${locale}`, request.url))
      }

      if (isAdminRoute) {
        const allowlist = getAllowlist()
        if (allowlist.length > 0 && !allowlist.includes((user.email || '').toLowerCase())) {
          const locale = getLocaleFromPath(pathname)
          const loginUrl = new URL(`/${locale}/admin/login`, request.url)
          loginUrl.searchParams.set('denied', '1')
          return NextResponse.redirect(loginUrl)
        }
      }

      return response
    } catch (error) {
      console.error('Proxy auth error:', error)
      const locale = getLocaleFromPath(pathname)
      const loginUrl = new URL(isAdminRoute ? `/${locale}/admin/login` : `/${locale}/login`, request.url)
      loginUrl.searchParams.set('error', 'session-error')
      return NextResponse.redirect(loginUrl)
    }
  }

  // 3. Default i18n response
  return i18nResponse
}
