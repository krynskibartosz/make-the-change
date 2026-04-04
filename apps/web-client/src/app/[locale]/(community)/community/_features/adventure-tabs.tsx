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
    { id: 'mouvement', label: 'Le Mouvement' },
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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md pt-4 pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
      <div className="grid grid-cols-3 gap-2 border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={isPending && activeTab === tab.id}
              className={cn(
                'flex flex-col items-center justify-center pb-3 pt-2 font-medium transition-all text-sm sm:text-base border-b-2',
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
  )
}
