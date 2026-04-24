import type { Metadata } from 'next'
import { FactionPage } from '../../_components/faction-page'
import { notFound } from 'next/navigation'
import { FACTION_COPY, type EcosystemFactionKey } from '@/lib/ecosystem/graph'

interface FactionPageProps {
  params: {
    key: string
    locale: string
  }
}

export async function generateMetadata({ params }: FactionPageProps): Promise<Metadata> {
  const factionKey = params.key as EcosystemFactionKey
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
  const factionKey = params.key as EcosystemFactionKey
  
  if (!FACTION_COPY[factionKey]) {
    notFound()
  }

  return <FactionPage factionKey={factionKey} />
}
