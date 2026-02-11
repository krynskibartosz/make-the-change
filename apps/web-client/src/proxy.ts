import { defaultLocale, locales } from '@make-the-change/core/i18n'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

export async function proxy(request: NextRequest) {
  // 1. Create the response with next-intl (handles routing, locale, etc.)
  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localePrefix: 'always',
  })

  const response = handleI18nRouting(request)

  // 2. Initialize Supabase client and manage cookies on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Update the request cookies (for immediate access in this request context)
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }

          // Update the response cookies (to persist in the browser)
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // 3. Refresh the session
  // This will trigger the `setAll` method above if the session needs refreshing
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/',
    '/(fr|en|nl)/:path*',
    // Match all other paths that are not API routes or static files
    '/((?!api|_next|.*\\..*).*)',
  ],
}
