import type { Metadata } from 'next'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import { getFactionThemeByKey } from '@/lib/faction-theme'
import { getFactionContributionByKey, getFactionContributions } from '@/lib/mock/mock-factions'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import type { Faction } from '@/lib/domain/types'
import type { FactionThemeKey } from '@/lib/faction-theme'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { SanctuaryHero } from './_components/sanctuary-hero'
import { SanctuaryContent } from './_components/sanctuary-content'

type LiveFactionThemeKey = 'pollinisateurs' | 'forets' | 'mers'

interface SanctuaryPageProps {
  params: Promise<{
    locale: string
    faction: string
  }>
}

const FACTION_CONFIG: Record<string, { name: string; title: string; mascot: string; emoji: string }> = {
  pollinisateurs: {
    name: 'Melli',
    title: 'Gardienne des Pollinisateurs',
    mascot: '/images/mascots/melli.png',
    emoji: '🐝',
  },
  forets: {
    name: 'Sylva',
    title: 'Gardienne des Forêts',
    mascot: '/images/mascots/sylva.png',
    emoji: '🌲',
  },
  mers: {
    name: 'Ondine',
    title: 'Gardienne des Mers',
    mascot: '/images/mascots/ondine.png',
    emoji: '🌊',
  },
}

export async function generateMetadata({ params }: SanctuaryPageProps): Promise<Metadata> {
  const { faction: factionKey } = await params
  const faction = FACTION_CONFIG[factionKey]
  return {
    title: `${faction?.name || 'Sanctuaire'} | Make the Change`,
  }
}

export default async function SanctuaryPage({ params }: SanctuaryPageProps) {
  await connection()
  const { faction: factionKey } = await params
  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const initialFaction: Faction | null = currentViewer?.faction ?? null
  const factionConfig = FACTION_CONFIG[factionKey]
  
  if (!factionConfig) {
    return notFound()
  }

  const theme = getFactionThemeByKey(factionKey as FactionThemeKey)
  const contribution = getFactionContributionByKey(factionKey as Exclude<FactionThemeKey, 'neutral'>)
  const contributions = getFactionContributions()
  const isLeading = contributions[0]?.themeKey === factionKey
  const biodexData = await getBiodexPreviewData({ unlockedLimit: 5, lockedLimit: 5 })

  const factionProjectLabel =
    factionKey === 'pollinisateurs'
      ? 'les projets liés aux pollinisateurs'
      : factionKey === 'forets'
        ? 'les projets de reforestation'
        : 'les projets de restauration marine'

  const factionMessage = isLeading
    ? `Votre énergie porte la communauté ce mois-ci. Ensemble, vous faites avancer ${factionProjectLabel}.`
    : `La nature a besoin d'un coup de pouce. Lançons ensemble de nouvelles actions aujourd'hui.`

  return (
    <FullScreenSlideModal
      title={factionConfig.title}
      fallbackHref="/impact"
      headerMode="dynamic"
      className="bg-[#0B0F15]"
      contentClassName="overflow-y-auto overscroll-contain"
    >
      <div className="flex flex-col">
        <SanctuaryHero
          mascot={factionConfig.mascot}
          name={factionConfig.name}
          title={factionConfig.title}
          accentBg={theme.accentBg}
          factionMessage={factionMessage}
        />

        <SanctuaryContent
          factionConfig={factionConfig}
          theme={theme}
          contribution={contribution}
          isLeading={isLeading}
          biodexData={biodexData}
        />
      </div>
    </FullScreenSlideModal>
  )
}
