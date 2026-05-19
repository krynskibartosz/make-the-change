import type { Metadata } from 'next'
import { getAtlasKinnuMapView } from '@/lib/learning/selectors'
import { AtlasWorldMap } from './_components/atlas-world-map'

export const metadata: Metadata = {
  title: 'Atlas du vivant | Make the Change',
}

export default function LearningAtlasPage() {
  const map = getAtlasKinnuMapView()

  return <AtlasWorldMap map={map} />
}
