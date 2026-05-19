import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEARNING_ATLAS_DOMAINS } from '@/lib/learning/catalog'
import { type LearningDomainId, learningDomainIdSchema } from '@/lib/learning/schema'
import { getAtlasDomainMap } from '@/lib/learning/selectors'
import { AtlasDomainMap } from '../_components/atlas-domain-map'

type LearningAtlasDomainPageProps = {
  params: Promise<{
    domainId: string
    locale: string
  }>
}

export function generateStaticParams() {
  return LEARNING_ATLAS_DOMAINS.map((domain) => ({ domainId: domain.id }))
}

export async function generateMetadata({
  params,
}: LearningAtlasDomainPageProps): Promise<Metadata> {
  const { domainId } = await params
  const parsedDomainId = learningDomainIdSchema.safeParse(domainId)

  if (!parsedDomainId.success) {
    return {
      title: 'Ile non trouvee | Make the Change',
    }
  }

  const map = getAtlasDomainMap(parsedDomainId.data)

  return {
    title: map
      ? `${map.domain.title} | Atlas du vivant | Make the Change`
      : 'Ile non trouvee | Make the Change',
  }
}

export default async function LearningAtlasDomainPage({ params }: LearningAtlasDomainPageProps) {
  const { domainId } = await params
  const parsedDomainId = learningDomainIdSchema.safeParse(domainId)

  if (!parsedDomainId.success) {
    notFound()
  }

  const map = getAtlasDomainMap(parsedDomainId.data as LearningDomainId)

  if (!map) {
    notFound()
  }

  return <AtlasDomainMap map={map} />
}
