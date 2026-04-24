import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { getFactionTheme, getFactionThemeByKey } from '@/lib/faction-theme'
import { getFactionContributionByKey, getFactionContributions } from '@/lib/mock/mock-factions'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import type { Faction } from '@/lib/mock/types'
import type { FactionThemeKey } from '@/lib/faction-theme'
import { getBiodexPreviewData } from '@/lib/api/biodex-preview.service'
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
    mascot: '/abeille-transparente.png',
    emoji: '🐝',
  },
  forets: {
    name: 'Sylva',
    title: 'Gardienne des Forêts',
    mascot: '/sylva.png',
    emoji: '🌲',
  },
  mers: {
    name: 'Ondine',
    title: 'Gardienne des Mers',
    mascot: '/ondine.png',
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

  const factionMessage = isLeading
    ? `Votre énergie est incroyable ce mois-ci ! Nos ${factionKey === 'pollinisateurs' ? 'ruches' : factionKey === 'forets' ? 'forêts' : 'océans'} bourdonnent de vie grâce à vous.`
    : `La nature a besoin d'un coup de pouce. Semons ensemble de nouvelles graines aujourd'hui.`

  return (
    <div className="min-h-screen bg-[#0B0F15]">
      <div className="relative min-h-screen">
        {/* Back button */}
        <div className="absolute left-5 top-8 sm:left-6 z-10">
          <Link
            href="/collectif"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ←
          </Link>
        </div>

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
    </div>
  )
}