'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function AdventureTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const activeTab = searchParams.get('tab') || 'defis'

  const tabs = [
    { id: 'defis', label: 'Défis' },
    { id: 'biodex', label: 'BioDex' },
    { id: 'mouvement', label: 'Collectif' },
  ]

  const handleTabChange = useCallback(
    (tabId: string) => {
      startTransition(() => {
        router.replace(`/aventure?tab=${tabId}`, { scroll: false })
      })
    },
    [router],
  )

  return (
    <>
      {/* Desktop: sticky top tab bar */}
      <div className="hidden px-4 sm:px-6 md:block sticky top-0 z-50 bg-background/95 backdrop-blur-lg mb-6 -mx-4 sm:-mx-6">
        <div className="flex w-full border-b border-white/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isPending && activeTab === tab.id}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center pb-4 pt-4 font-medium transition-all text-sm px-1 sm:text-base border-b-2 -mb-[1px]',
                  isActive
                    ? 'border-lime-400 text-foreground font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/50',
                  isPending && 'opacity-70',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* iOS 26 mobile: floating segmented control at the bottom, above the bottom nav */}
      <div
        className="md:hidden  fixed left-0 right-0 z-40 flex justify-center px-4 sm:px-6"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <div className="flex w-full max-w-sm items-center rounded-2xl border border-white/10 bg-background/90 backdrop-blur-xl shadow-2xl p-1.5 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isPending && activeTab === tab.id}
                className={cn(
                  'flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all active:scale-95',
                  isActive
                    ? 'bg-lime-400 text-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                  isPending && 'opacity-70',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
