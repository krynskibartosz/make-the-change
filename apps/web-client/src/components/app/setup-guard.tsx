'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'

const bypassPrefixes = ['/login', '/register', '/setup']

export function SetupGuard() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isMockDataSource) {
      return
    }

    if (bypassPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return
    }

    const session = getClientMockViewerSession()
    if (!session || session.faction) {
      return
    }

    const query = searchParams.toString()
    const currentUrl = query ? `${pathname}?${query}` : pathname
    router.replace(`/setup?returnTo=${encodeURIComponent(currentUrl)}`)
  }, [pathname, router, searchParams])

  return null
}
