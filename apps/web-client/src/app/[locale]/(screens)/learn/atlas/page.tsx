import type { Metadata } from 'next'
import { getAtlasKinnuMapView } from '@/lib/learning/selectors'
import { AtlasWorldMap } from './_components/atlas-world-map'

export const metadata: Metadata = {
  title: 'Atlas du vivant | Make the Change',
}

// Note: params ({ locale }) are handled upstream by next-intl middleware and not consumed here.
// In Next.js 16, params is a Promise — if locale is needed in the future:
//   const { locale } = await params  (Server Component)
//   const { locale } = use(params)   (Client Component)
export default async function LearningAtlasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const map = getAtlasKinnuMapView()

  return <AtlasWorldMap map={map} />
}

