import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import {
  CommunityPageFrame,
  getCommunitySidebarUser,
} from './_features/community-page-frame'
import { CommunityRightRail } from './_features/community-right-rail'
import { AdventureTabs } from './_features/adventure-tabs'
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
    const sidebarUser = await getCommunitySidebarUser()

    return (
      <CommunityPageFrame
        sidebarUser={sidebarUser}
        rightRail={<CommunityRightRail variant="default" activeTag="" />}
      >
        <div className="pt-safe pt-2 px-4 sm:px-6 relative">
          <Suspense fallback={null}>
            <AdventureTabs />
          </Suspense>

          <div className="mt-4 pb-12">
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
      </CommunityPageFrame>
    )
  } catch (error) {
    console.error('Error loading adventure hub page:', error)
    throw error // Let Next.js error boundary handle it
  }
}
