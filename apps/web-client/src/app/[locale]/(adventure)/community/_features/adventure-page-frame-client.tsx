'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Clock, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdventureLeftSidebar } from './adventure-left-sidebar'
import { getCurrentSeason, getSeasonTimeRemaining } from '@/lib/mock/mock-seasons'

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
}

function SeasonCountdownHeader() {
  const currentSeason = getCurrentSeason()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getSeasonTimeRemaining())
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}j ${hours}h`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  if (!currentSeason) return null

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Clock className="h-4 w-4 text-white/40" />
        <p className="text-[11px] font-medium text-white/40">
          ⏱️ {currentSeason.name} • {formatTimeRemaining(timeRemaining)} restantes
        </p>
      </div>
      
      <Link
        href="?p=reward"
        scroll={false}
        className="flex flex-1 h-7 w-7 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 transition-transform hover:scale-110 active:scale-95"
        aria-label="Voir la récompense du mois"
      >
        <Gift className="h-3.5 w-3.5" />
      </Link>
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
}: AdventurePageFrameClientProps) {
  const hasRightRail = !!rightRail

  return (
    <div className="fixed inset-0 z-40 bg-[#0B0F15] sm:relative sm:bg-background">
      {showStickyHeader && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/95 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex h-12 max-w-3xl items-center">
            <SeasonCountdownHeader />
          </div>
        </header>
      )}
      <div className="mx-auto flex h-[100dvh] w-full max-w-[1260px] flex-col pt-16 sm:pt-0 sm:h-auto sm:flex-row justify-center overflow-y-auto overflow-x-hidden overscroll-y-contain sm:overflow-visible">
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
