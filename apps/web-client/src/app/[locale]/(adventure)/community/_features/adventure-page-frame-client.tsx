'use client'

import type { ReactNode } from 'react'
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
      <div className="mx-auto flex w-full max-w-[1260px] justify-center">
        <div className="hidden shrink-0 sm:block sm:w-[240px] lg:w-[275px]">
          <header className="sticky top-0 flex h-screen flex-col justify-between overflow-y-auto">
            <AdventureLeftSidebar user={sidebarUser} />
          </header>
        </div>

        <main
          className={cn(
            'flex min-h-screen w-full max-w-[600px] shrink-0 flex-col border-x border-border',
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
