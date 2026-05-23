import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { ImpactTab } from '@/app/[locale]/(screens)/impact/_features/impact-tab'
import { ImpactTabHeader } from '@/app/[locale]/(screens)/impact/_features/impact-tab-header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collectif | Make the Change',
  }
}

const fallbackLoader = (
  <div className="flex h-[40vh] w-full animate-pulse flex-col items-center justify-center gap-4 text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent" />
    <p className="font-medium">Chargement du collectif...</p>
  </div>
)

export default async function CollectifPage() {
  return (
    <TabScreen header={<ImpactTabHeader />} className="bg-[#0B0F15]">
      <Suspense fallback={fallbackLoader}>
        <ImpactTab />
      </Suspense>
    </TabScreen>
  )
}
