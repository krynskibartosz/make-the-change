'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { buildReturnToWithIntent, getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { ChallengeIntent } from '@/lib/mock/types'

type GuardActionOptions = {
  intent: ChallengeIntent
  extraParams?: Record<string, string | undefined>
}

export function useActionAuth() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const guardAction = useCallback(
    (action: () => void, options: GuardActionOptions) => {
      if (!isMockDataSource) {
        action()
        return
      }

      const session = getClientMockViewerSession()
      if (session?.faction) {
        action()
        return
      }

      const returnTo = buildReturnToWithIntent(
        pathname,
        searchParams,
        options.intent,
        options.extraParams,
      )

      if (!session) {
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)
        return
      }

      router.push(`/setup?returnTo=${encodeURIComponent(returnTo)}`)
    },
    [pathname, router, searchParams],
  )

  return { guardAction }
}
