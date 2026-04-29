import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type EcosystemFactionKey, FACTION_COPY } from '@/lib/ecosystem/graph'
import { FactionPage } from '../../_components/faction-page'

interface FactionPageProps {
  params: Promise<{
    key: string
    locale: string
  }>
}

export async function generateMetadata({ params }: FactionPageProps): Promise<Metadata> {
  const { key } = await params
  const factionKey = key as EcosystemFactionKey
  const faction = FACTION_COPY[factionKey]

  if (!faction) {
    return {
      title: 'Faction non trouvée | Make the Change',
    }
  }

  return {
    title: `${faction.name} | Toile Vivante | Make the Change`,
  }
}

export default async function FactionDetailPage({ params }: FactionPageProps) {
  const { key } = await params
  const factionKey = key as EcosystemFactionKey

  if (!FACTION_COPY[factionKey]) {
    notFound()
  }

  return <FactionPage factionKey={factionKey} />
}
