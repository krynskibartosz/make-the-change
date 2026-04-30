'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Sprout } from 'lucide-react'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockImpactPoints } from '@/lib/mock/mock-member-data'

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
        href="/seeds"
        prefetch={false}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-transform hover:scale-105 active:scale-95"
      >
        <Sprout className="h-3.5 w-3.5 text-lime-400" />
        <span className="text-xs font-bold text-white tabular-nums">
          {seeds.toLocaleString('fr-FR')}
        </span>
      </Link>
    </div>
  )
}
