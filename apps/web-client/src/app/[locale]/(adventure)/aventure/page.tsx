import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import {
  AdventurePageFrame,
  getAdventureSidebarUser,
} from '@/app/[locale]/(adventure)/aventure/_features/adventure-page-frame'
import { getCurrentMockChallengeSurface } from '@/lib/mock/mock-challenge-progress-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { AdventureChallenges } from './_features/adventure-challenges'

type AdventureHubProps = {
  searchParams: Promise<{
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
      showStickyHeader={true}
      showSeason={false}
      showRewardIcon={false}
    >
      <div className="relative w-full">
 
        <Suspense fallback={fallbackLoader}>
          <AdventureChallenges
            initialFaction={currentViewer?.faction ?? null}
            viewerId={currentViewer?.viewerId ?? null}
            initialDayKey={challengeSurface?.dayKey ?? null}
            initialDayLabel={challengeSurface?.dayLabel ?? 'aujourd\'hui'}
            initialDailyQuests={challengeSurface?.dailyChallenges ?? []}
            initialMonthlyQuest={challengeSurface?.monthlyQuest ?? null}
          />
        </Suspense>
      </div>
    </AdventurePageFrame>
  )
}
