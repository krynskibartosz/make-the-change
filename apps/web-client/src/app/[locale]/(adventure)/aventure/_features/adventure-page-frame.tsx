import type { ReactNode } from 'react'
import { AdventurePageFrameClient } from './adventure-page-frame-client'

type AdventurePageFrameProps = {
  children: ReactNode
  centerClassName?: string
  showStickyHeader?: boolean
  showSeeds?: boolean
  showSeason?: boolean
  showRewardIcon?: boolean
}



export async function AdventurePageFrame({
  children,
  centerClassName,
  showStickyHeader = false,
  showSeeds = true,
  showSeason = true,
  showRewardIcon = true,
}: AdventurePageFrameProps) {

  return (
    <AdventurePageFrameClient
      centerClassName={centerClassName}
      showStickyHeader={showStickyHeader}
      showSeeds={showSeeds}
      showSeason={showSeason}
      showRewardIcon={showRewardIcon}
    >
      {children}
    </AdventurePageFrameClient>
  )
}
