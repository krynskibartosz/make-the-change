import type { Metadata } from 'next'
import { getAtlasIslandViews } from '@/lib/learning/selectors'
import { AtlasWorldMap } from './_components/atlas-world-map'

export const metadata: Metadata = {
  title: 'Atlas du vivant | Make the Change',
}

export default function LearningAtlasPage() {
  const islands = getAtlasIslandViews()

  return <AtlasWorldMap islands={islands} />
}
