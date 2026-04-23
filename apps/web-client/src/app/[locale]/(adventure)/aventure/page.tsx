import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import {
  AdventurePageFrame,
  getAdventureSidebarUser,
} from '@/app/[locale]/(adventure)/community/_features/adventure-page-frame'
import { AdventureRightRail } from '@/app/[locale]/(adventure)/community/_features/adventure-right-rail'
import { AdventureTabs } from '@/app/[locale]/(adventure)/community/_features/adventure-tabs'
import { AdventureBiodex } from '@/app/[locale]/(adventure)/community/_features/adventure-biodex'
import { AdventureChallenges } from '@/app/[locale]/(adventure)/community/_features/adventure-challenges'
import { getCurrentMockChallengeSurface } from '@/lib/mock/mock-challenge-progress-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'

type AdventureHubProps = {
  searchParams: Promise<{
    tab?: string
    day?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Mon Aventure | Make the Change`,
  }
}

const fallbackLoader = (
  <div className="h-[40vh] w-full flex flex-col gap-4 items-center justify-center animate-pulse text-muted-foreground">
    <div className="h-10 w-10 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
    <p className="font-medium">Chargement de votre aventure...</p>
  </div>
)

export default async function AdventureHubPage({ searchParams }: AdventureHubProps) {
  await connection()
  const params = await searchParams
  const activeTab = params.tab === 'biodex' ? 'biodex' : 'defis'
  const sidebarUser = await getAdventureSidebarUser()
  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const challengeSurface = isMockDataSource
    ? await getCurrentMockChallengeSurface({
        viewerId: currentViewer?.viewerId ?? null,
        faction: currentViewer?.faction ?? null,
      })
    : null

  return (
    <AdventurePageFrame
      sidebarUser={sidebarUser}
      rightRail={<AdventureRightRail variant="default" activeTag="" />}
      showStickyHeader={true}
    >
      <div className="relative w-full">
        <Suspense fallback={null}>
          <AdventureTabs />
        </Suspense>

        <Suspense fallback={fallbackLoader}>
          {activeTab === 'defis' && (
            <AdventureChallenges
              initialFaction={currentViewer?.faction ?? null}
              viewerId={currentViewer?.viewerId ?? null}
              initialDayKey={challengeSurface?.dayKey ?? null}
              initialDayLabel={challengeSurface?.dayLabel ?? 'aujourd\'hui'}
              initialDailyQuests={challengeSurface?.dailyChallenges ?? []}
              initialMonthlyQuest={challengeSurface?.monthlyQuest ?? null}
            />
          )}
          {activeTab === 'biodex' && <AdventureBiodex initialFaction={currentViewer?.faction ?? null} />}
        </Suspense>
      </div>
    </AdventurePageFrame>
  )
}
