'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { buildReturnToWithIntent, getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { ChallengeIntent, Faction } from '@/lib/mock/types'

type GuardActionOptions = {
  intent: ChallengeIntent
  extraParams?: Record<string, string | undefined>
}

type ActionAuthFallback = {
  viewerId?: string | null
  faction?: Faction | null
}

export function useActionAuth(fallbackViewer?: ActionAuthFallback) {
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
      const effectiveViewerId = session?.viewerId ?? fallbackViewer?.viewerId ?? null
      const effectiveFaction = session?.faction ?? fallbackViewer?.faction ?? null

      if (effectiveFaction) {
        action()
        return
      }

      const returnTo = buildReturnToWithIntent(
        pathname,
        searchParams,
        options.intent,
        options.extraParams,
      )

      if (!effectiveViewerId) {
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)
        return
      }

      router.push(`/setup?returnTo=${encodeURIComponent(returnTo)}`)
    },
    [fallbackViewer?.faction, fallbackViewer?.viewerId, pathname, router, searchParams],
  )

  return { guardAction }
}
