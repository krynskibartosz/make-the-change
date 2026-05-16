import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { getCurrentMockWalletBalance } from '@/lib/mock/mock-member-data-server'
import { LearnTab } from './_features/learn-tab'
import { LearnTabHeader } from './_features/learn-tab-header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Apprendre | Make the Change',
  }
}

const fallbackLoader = (
  <div className="flex h-[40vh] w-full animate-pulse flex-col items-center justify-center gap-4 text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-400 border-t-transparent" />
    <p className="font-medium">Chargement...</p>
  </div>
)

export default async function LearnPage() {
  await connection()

  const viewer = isMockDataSource ? await getCurrentViewer() : null
  const viewerId = viewer?.viewerId ?? null
  const faction = viewer?.faction ?? null
  const seeds = viewerId ? await getCurrentMockWalletBalance(viewerId, faction) : 0

  return (
    <TabScreen
      header={<LearnTabHeader seeds={seeds} />}
      className="bg-[#0B0F15]"
    >
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <LearnTab seeds={seeds} />
        </Suspense>
      </div>
    </TabScreen>
  )
}
