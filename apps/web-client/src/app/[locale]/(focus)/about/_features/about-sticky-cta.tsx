'use client'

import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import type { AboutCtaProps } from './about.types'

export function AboutStickyCta({ label }: AboutCtaProps) {
  const router = useRouter()
  const t = useTranslations('about')
  const [userState, setUserState] = useState<{
    isConnected: boolean
    hasFaction: boolean
    hasSubscription: boolean
  }>({
    isConnected: false,
    hasFaction: false,
    hasSubscription: false,
  })

  useEffect(() => {
    const session = getClientMockViewerSession()
    const subscription = session ? getMockSubscription(session.viewerId) : null
    setUserState({
      isConnected: !!session,
      hasFaction: !!session?.faction,
      hasSubscription: subscription?.status === 'active',
    })
  }, [])

  const getConditionalLabel = useCallback(() => {
    if (!userState.isConnected) {
      return t('cta.not_connected')
    }
    if (!userState.hasFaction) {
      return t('cta.no_faction')
    }
    if (!userState.hasSubscription) {
      return t('cta.no_subscription')
    }
    return t('cta.ready')
  }, [t, userState])

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    // Logique de redirection intelligente
    if (!userState.isConnected) {
      router.push('/onboarding/step-0')
      return
    }

    if (!userState.hasFaction) {
      router.push('/welcome/setup')
      return
    }

    if (!userState.hasSubscription) {
      router.push('/dashboard/subscription')
      return
    }

    router.push('/aventure?tab=defis')
  }, [router, userState])

  return (
    <div
      className="px-4 pt-10"
      style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="group mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-[0_8px_32px_-8px_rgba(16,185,129,0.7)] transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
      >
        <span>{getConditionalLabel()}</span>
        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
