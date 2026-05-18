import type { Metadata } from 'next'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { getAtlasIslandViews } from '@/lib/learning/selectors'
import { AtlasArchipelago } from './_components/atlas-archipelago'

export const metadata: Metadata = {
  title: 'Atlas du vivant | Make the Change',
}

export default function LearningAtlasPage() {
  const islands = getAtlasIslandViews()

  return (
    <TabScreen className="bg-[#0B0F15]">
      <AtlasArchipelago islands={islands} />
    </TabScreen>
  )
}
