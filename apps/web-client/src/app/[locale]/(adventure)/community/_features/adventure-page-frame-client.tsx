'use client'

import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdventureLeftSidebar } from './adventure-left-sidebar'

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
}

export function AdventurePageFrameClient({
  children,
  rightRail,
  sidebarUser = null,
  centerClassName,
  rightRailClassName,
}: AdventurePageFrameClientProps) {
  const hasRightRail = !!rightRail

  return (
    <div className="relative bg-background">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F15]/95 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-end px-4">
          <Link
            href="/settings"
            aria-label="Paramètres"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-[1260px] justify-center">
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
