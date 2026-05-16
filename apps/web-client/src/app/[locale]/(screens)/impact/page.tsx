import type { Metadata } from 'next'
import { Suspense } from 'react'
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
    <div className="fixed inset-0 z-40 bg-[#0B0F15] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/88 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-lg">
        <div className="mx-auto flex h-12 max-w-3xl items-center">
          <ImpactTabHeader />
        </div>
      </header>
      <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden overscroll-y-contain pt-[calc(3.5rem+max(0.75rem,env(safe-area-inset-top)))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Suspense fallback={fallbackLoader}>
          <ImpactTab />
        </Suspense>
      </div>
    </div>
  )
}
