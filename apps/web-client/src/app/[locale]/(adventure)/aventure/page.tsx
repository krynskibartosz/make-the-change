import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import {
  AdventurePageFrame,
  getAdventureSidebarUser,
} from '@/app/[locale]/(adventure)/community/_features/adventure-page-frame'
import { AdventureRightRail } from '@/app/[locale]/(adventure)/community/_features/adventure-right-rail'
import { AdventureStaticHeader } from '@/app/[locale]/(adventure)/community/_features/adventure-static-header'
import { AdventureTabs } from '@/app/[locale]/(adventure)/community/_features/adventure-tabs'
import { AdventureBiodex } from '@/app/[locale]/(adventure)/community/_features/adventure-biodex'
import { AdventureChallenges } from '@/app/[locale]/(adventure)/community/_features/adventure-challenges'

type AdventureHubProps = {
  searchParams: Promise<{
    tab?: string
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

  return (
    <AdventurePageFrame
      sidebarUser={sidebarUser}
      rightRail={<AdventureRightRail variant="default" activeTag="" />}
    >
      <div className="relative w-full">
        <AdventureStaticHeader user={sidebarUser} />

        <Suspense fallback={null}>
          <AdventureTabs />
        </Suspense>

        <Suspense fallback={fallbackLoader}>
          {activeTab === 'defis' && <AdventureChallenges />}
          {activeTab === 'biodex' && <AdventureBiodex />}
        </Suspense>
      </div>
    </AdventurePageFrame>
  )
}
