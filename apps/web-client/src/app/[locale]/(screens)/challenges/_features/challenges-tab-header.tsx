'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockImpactPoints } from '@/lib/mock/mock-member-data'
import { CurrencyIcon } from '@/components/currency'

export function ChallengesTabHeader() {
  const [seeds, setSeeds] = useState<number>(0)

  useEffect(() => {
    const session = getClientMockViewerSession()
    if (session) {
      setSeeds(getMockImpactPoints(session.viewerId))
    }
  }, [])

  return (
    <div className="flex items-center justify-end w-full">
      <Link
        href="/profile/seeds"
        prefetch={false}
        className="relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-transform hover:scale-105 active:scale-95 after:absolute after:-inset-3"
      >
        <CurrencyIcon kind="seeds" className="h-3.5 w-3.5" />
        <span className="text-xs font-bold text-white tabular-nums">
          {seeds.toLocaleString('fr-FR')}
        </span>
      </Link>
    </div>
  )
}
