import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import {
  AdventurePageFrame,
  getAdventureSidebarUser,
} from './_features/adventure-page-frame'
import { AdventureRightRail } from './_features/adventure-right-rail'
import { AdventureTabs } from './_features/adventure-tabs'
import { Link } from '@/i18n/navigation'
import { AdventureChallenges } from './_features/adventure-challenges'
import { AdventureBiodex } from './_features/adventure-biodex'
import { AdventureMovement } from './_features/adventure-movement'

type AdventureHubProps = {
  searchParams: Promise<{
    tab?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('navigation')
  return {
    title: `Mon Aventure | Make the Change`,
  }
}

export default async function AdventureHubPage({ searchParams }: AdventureHubProps) {
  try {
    const params = await searchParams
    const activeTab = params.tab || 'defis'
    
    // Optimize performance: we still need sidebar user for the right-rail
    const sidebarUser = await getAdventureSidebarUser()

    return (
      <AdventurePageFrame
        sidebarUser={sidebarUser}
        rightRail={<AdventureRightRail variant="default" activeTag="" />}
      >
        <div className="px-4 sm:px-6 relative">
          <div className="md:sticky md:top-0 z-20 space-y-3 bg-background pb-2 md:backdrop-blur-md pt-6">
            <h1 className="text-xl font-bold">Communauté</h1>
            <div className="flex gap-6 border-b border-white/10 mb-6 mt-4">
              <Link href="/community" className="border-b-2 border-lime-400 text-foreground pb-2 font-medium">Le Fil</Link>
              <Link href="/community/guilds" className="text-muted-foreground pb-2 hover:text-foreground font-medium">Mes Guildes</Link>
            </div>
          </div>

          <Suspense fallback={null}>
            <AdventureTabs />
          </Suspense>

          <div className="mt-4 pb-48 md:pb-12">
            <Suspense fallback={
              <div className="h-[40vh] flex flex-col gap-4 items-center justify-center animate-pulse text-muted-foreground">
                <div className="h-10 w-10 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
                <p className="font-medium">Chargement de votre aventure...</p>
              </div>
            }>
              {activeTab === 'defis' && <AdventureChallenges />}
              {activeTab === 'biodex' && <AdventureBiodex />}
              {activeTab === 'mouvement' && <AdventureMovement />}
            </Suspense>
          </div>
        </div>
      </AdventurePageFrame>
    )
  } catch (error) {
    console.error('Error loading adventure hub page:', error)
    throw error // Let Next.js error boundary handle it
  }
}
