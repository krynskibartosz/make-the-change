import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { ImpactTabHeader } from './_features/impact-tab-header'
import { ImpactTab } from './_features/impact-tab'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Impact | Make the Change`,
  }
}

const fallbackLoader = (
  <div className="h-[40vh] w-full flex flex-col gap-4 items-center justify-center animate-pulse text-muted-foreground">
    <div className="h-10 w-10 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
    <p className="font-medium">Chargement de l'impact...</p>
  </div>
)

export default async function ImpactPage() {
  return (
    <TabScreen header={<ImpactTabHeader />}>
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <ImpactTab />
        </Suspense>
      </div>
    </TabScreen>
  )
}
