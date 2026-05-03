import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { ChallengesTabHeader } from './_features/challenges-tab-header'
import { ChallengesTabContent } from './_features/challenges-tab-content'
import { getCurrentMockChallengeSurface } from '@/lib/mock/mock-challenge-progress-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Défis | Make the Change`,
  }
}

const fallbackLoader = (
  <div className="h-[40vh] w-full flex flex-col gap-4 items-center justify-center animate-pulse text-muted-foreground">
    <div className="h-10 w-10 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
    <p className="font-medium">Chargement des défis...</p>
  </div>
)

export default async function ChallengesPage() {
  await connection()
  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const challengeSurface = isMockDataSource
    ? await getCurrentMockChallengeSurface({
        viewerId: currentViewer?.viewerId ?? null,
        faction: currentViewer?.faction ?? null,
      })
    : null

  return (
    <TabScreen header={<ChallengesTabHeader />}>
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <ChallengesTabContent
            initialFaction={currentViewer?.faction ?? null}
            viewerId={currentViewer?.viewerId ?? null}
            initialDayKey={challengeSurface?.dayKey ?? null}
            initialDayLabel={challengeSurface?.dayLabel ?? 'aujourd\'hui'}
            initialDailyQuests={challengeSurface?.dailyChallenges ?? []}
            initialMonthlyQuest={challengeSurface?.monthlyQuest ?? null}
          />
        </Suspense>
      </div>
    </TabScreen>
  )
}
