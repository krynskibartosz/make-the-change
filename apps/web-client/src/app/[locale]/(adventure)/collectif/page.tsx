import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  AdventurePageFrame,
  getAdventureSidebarUser,
} from '@/app/[locale]/(adventure)/community/_features/adventure-page-frame'
import { AdventureMovement } from '@/app/[locale]/(adventure)/community/_features/adventure-movement'
import { AdventureRightRail } from '@/app/[locale]/(adventure)/community/_features/adventure-right-rail'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Collectif | Make the Change`,
  }
}

const fallbackLoader = (
  <div className="h-[40vh] w-full flex flex-col gap-4 items-center justify-center animate-pulse text-muted-foreground">
    <div className="h-10 w-10 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
    <p className="font-medium">Chargement du collectif...</p>
  </div>
)

export default async function CollectifPage() {
  const sidebarUser = await getAdventureSidebarUser()

  return (
    <AdventurePageFrame
      sidebarUser={sidebarUser}
      rightRail={<AdventureRightRail variant="default" activeTag="" />}
      showStickyHeader={true}
      showSeeds={false}
    >
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <AdventureMovement />
        </Suspense>
      </div>
    </AdventurePageFrame>
  )
}
