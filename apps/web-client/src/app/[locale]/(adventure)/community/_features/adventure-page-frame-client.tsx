'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Clock, Gift, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdventureLeftSidebar } from './adventure-left-sidebar'
import { getCurrentSeason, getSeasonTimeRemaining } from '@/lib/mock/mock-seasons'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockImpactPoints } from '@/lib/mock/mock-member-data'

type AdventureSidebarUser = {
  id: string
  email: string
  avatarUrl: string | null
  displayName: string
} | null

type AdventurePageFrameClientProps = {
  children: ReactNode
  rightRail?: ReactNode
  sidebarUser?: AdventureSidebarUser
  centerClassName?: string
  rightRailClassName?: string
  showStickyHeader?: boolean
  showSeeds?: boolean
}

function SeasonCountdownHeader({ showSeeds = true }: { showSeeds?: boolean }) {
  const currentSeason = getCurrentSeason()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [seeds, setSeeds] = useState<number>(0)

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getSeasonTimeRemaining())
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    // Récupérer les graines
    if (showSeeds) {
      const session = getClientMockViewerSession()
      if (session) {
        setSeeds(getMockImpactPoints(session.viewerId))
      }
    }

    return () => clearInterval(interval)
  }, [showSeeds])

  const formatTimeRemaining = (ms: number) => {
    const rtf = new Intl.RelativeTimeFormat('fr', {
      numeric: 'auto',
      style: 'narrow'
    })
    
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return rtf.format(days, 'day')
    }
    if (hours > 0) {
      return rtf.format(hours, 'hour')
    }
    if (minutes > 0) {
      return rtf.format(minutes, 'minute')
    }
    return rtf.format(seconds, 'second')
  }

  if (!currentSeason) return null

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-1 items-center gap-2">
        <Clock className="h-4 w-4 text-white/40" />
        <p className="text-[11px] font-medium text-white/40">
           {currentSeason.name} • {formatTimeRemaining(timeRemaining)} restantes
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Affichage des graines */}
        {showSeeds && (
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Sprout className="h-3.5 w-3.5 text-lime-400" />
            <span className="text-xs font-bold text-white tabular-nums">
              {seeds.toLocaleString('fr-FR')}
            </span>
          </div>
        )}

        <Link
          href="?p=reward"
          scroll={false}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Voir la récompense du mois"
        >
          <Gift className="h-5 w-5 text-lime-400" />
        </Link>
      </div>
    </div>
  )
}

export function AdventurePageFrameClient({
  children,
  rightRail,
  sidebarUser = null,
  centerClassName,
  rightRailClassName,
  showStickyHeader = false,
  showSeeds = true,
}: AdventurePageFrameClientProps) {
  const hasRightRail = !!rightRail

  return (
    <div className="fixed inset-0 z-40 bg-[#0B0F15] sm:relative sm:bg-background">
      {showStickyHeader && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/95 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex h-16 max-w-3xl items-center">
            <SeasonCountdownHeader showSeeds={showSeeds} />
          </div>
        </header>
      )}
      <div className="mx-auto flex h-[100dvh] w-full max-w-[1260px] flex-col pt-20 sm:pt-0 sm:h-auto sm:flex-row justify-center overflow-y-auto overflow-x-hidden overscroll-y-contain sm:overflow-visible">
        <div className="hidden shrink-0 sm:block sm:w-[240px] lg:w-[275px]">
          <header className="sticky top-0 flex h-screen flex-col justify-between overflow-y-auto">
            <AdventureLeftSidebar user={sidebarUser} />
          </header>
        </div>

        <main
          className={cn(
            'flex  w-full max-w-[600px]  ',
            centerClassName,
          )}
        >
          {children}
        </main>

        {hasRightRail ? (
          <div className={cn('hidden w-[350px] shrink-0 lg:block', rightRailClassName)}>
            <aside className="sticky top-0 h-screen overflow-y-auto px-6 py-4">{rightRail}</aside>
          </div>
        ) : null}
      </div>
    </div>
  )
}
