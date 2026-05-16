import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentMockImpactPoints } from '@/lib/mock/mock-member-data-server'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { AdvantagesTab } from './_features/advantages-tab'
import { getAdvantagesData } from './_features/advantages-data'
import { AdvantagesTabHeader } from './_features/advantages-tab-header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Avantages | Make the Change',
  }
}

const fallbackLoader = (
  <div className="flex h-[40vh] w-full animate-pulse flex-col items-center justify-center gap-4 text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent" />
    <p className="font-medium">Chargement des avantages...</p>
  </div>
)

export default async function AdvantagesPage() {
  await connection()

  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const viewerId = currentViewer?.viewerId ?? null
  const faction = currentViewer?.faction ?? null
  const impactCredits = viewerId ? await getCurrentMockImpactPoints(viewerId, faction) : 0
  const data = getAdvantagesData()

  return (
    <TabScreen
      header={<AdvantagesTabHeader impactCredits={impactCredits} />}
      className="bg-[#0B0F15]"
      contentClassName="scroll-pt-6"
    >
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <AdvantagesTab impactCredits={impactCredits} data={data} />
        </Suspense>
      </div>
    </TabScreen>
  )
}
