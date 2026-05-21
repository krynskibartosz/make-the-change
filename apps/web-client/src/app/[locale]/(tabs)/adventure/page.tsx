import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { getSeasonProgress } from '@/app/[locale]/(screens)/impact/_lib/mock-seasons'
import { getProjects } from '@/app/[locale]/(tabs)/projects/_features/get-projects'
import { getProjectImpactDisplay } from '@/app/[locale]/(tabs)/projects/_features/project-map-data'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockSpeciesContextList } from '@/lib/mock/mock-biodex'
import { getCurrentMockChallengeSurface } from '@/lib/mock/mock-challenge-progress-server'
import type { MockChallengeDetail } from '@/lib/mock/mock-challenges'
import {
  getCurrentMockImpactCreditsBalance,
  getCurrentMockWalletBalance,
} from '@/lib/mock/mock-member-data-server'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import type { Faction } from '@/lib/domain/types'
import type { SpeciesContext } from '@/types/species'
import { type AdventureQuestCard, AdventureTab } from './_features/adventure-tab'
import { AdventureTabHeader } from './_features/adventure-tab-header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Aventure | Make the Change',
  }
}

const fallbackLoader = (
  <div className="flex h-[40vh] w-full animate-pulse flex-col items-center justify-center gap-4 text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent" />
    <p className="font-medium">Chargement de l&apos;aventure...</p>
  </div>
)

function getQuestHref({
  quest,
  dayKey,
  faction,
  viewerId,
}: {
  quest: MockChallengeDetail
  dayKey: string | null
  faction: Faction | null
  viewerId: string | null
}) {
  const query = new URLSearchParams()
  if (faction) query.set('faction', faction)
  if (quest.id) query.set('challengeId', quest.id)
  if (viewerId) query.set('viewerId', viewerId)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const resolvedDayKey = dayKey || 'today'

  if (quest.type === 'education') {
    return `/challenges/eco-fact/${resolvedDayKey}${suffix}`
  }

  if (quest.type === 'daily_harvest') {
    return `/challenges/daily-harvest/${resolvedDayKey}${suffix}`
  }

  return quest.href || '/challenges'
}

function getQuestCta(type: MockChallengeDetail['type']) {
  if (type === 'education') return 'Apprendre'
  if (type === 'daily_harvest') return 'Recolter'
  return 'Participer'
}

function toAdventureQuestCard({
  quest,
  dayKey,
  faction,
  viewerId,
}: {
  quest: MockChallengeDetail
  dayKey: string | null
  faction: Faction | null
  viewerId: string | null
}): AdventureQuestCard {
  return {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    reward: quest.reward,
    progress: quest.progress,
    max: quest.max,
    type: quest.type,
    href: getQuestHref({ quest, dayKey, faction, viewerId }),
    cta: getQuestCta(quest.type),
  }
}

function getSpeciesForProject(species: SpeciesContext[], projectSlug: string | null | undefined) {
  if (!projectSlug) {
    return species.find((entry) => entry.user_status?.isUnlocked) ?? species[0] ?? null
  }

  return (
    species.find((entry) =>
      entry.associated_projects?.some((project) => project.slug === projectSlug),
    ) ??
    species.find((entry) => entry.user_status?.isUnlocked) ??
    species[0] ??
    null
  )
}

export default async function AdventurePage() {
  await connection()

  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const viewerId = currentViewer?.viewerId ?? null
  const faction = currentViewer?.faction ?? null

  const [challengeSurface, projects, speciesList, seeds, impactPoints] = await Promise.all([
    isMockDataSource
      ? getCurrentMockChallengeSurface({
          viewerId,
          faction,
        })
      : Promise.resolve(null),
    getProjects({ status: 'active' }),
    getMockSpeciesContextList(viewerId, faction),
    viewerId ? getCurrentMockWalletBalance(viewerId, faction) : Promise.resolve(0),
    viewerId ? getCurrentMockImpactCreditsBalance(viewerId, faction) : Promise.resolve(0),
  ])

  const recommendedProject =
    projects.find((project) => project.featured && project.status === 'active') ??
    projects.find((project) => project.status === 'active') ??
    projects[0] ??
    null
  const recommendedProjectImpact = recommendedProject
    ? getProjectImpactDisplay(recommendedProject)
    : null
  const linkedSpecies = getSpeciesForProject(speciesList, recommendedProject?.slug)
  const quests =
    challengeSurface?.dailyChallenges.map((quest) =>
      toAdventureQuestCard({
        quest,
        dayKey: challengeSurface.dayKey,
        faction,
        viewerId,
      }),
    ) ?? []
  const primaryQuest = quests.find((quest) => quest.progress < quest.max) ?? quests[0] ?? null
  const monthlyQuest = challengeSurface?.monthlyQuest ?? null
  const projectProgress = recommendedProject?.funding_progress ?? 0
  const projectLocation = [
    recommendedProject?.address_city,
    recommendedProject?.address_country_code,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <TabScreen
      header={<AdventureTabHeader faction={faction} seeds={seeds} impactPoints={impactPoints} />}
      className="bg-[#0B0F15]"
      contentClassName="scroll-pt-6"
    >
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <AdventureTab
            displayName={currentViewer?.displayName ?? null}
            faction={faction}
            dayLabel={challengeSurface?.dayLabel ?? "aujourd'hui"}
            monthlyObjective={monthlyQuest?.objective ?? 'Explorer le vivant chaque semaine'}
            monthlyProgress={monthlyQuest?.progress ?? 0}
            monthlyMax={monthlyQuest?.max ?? 20}
            primaryQuest={primaryQuest}
            quests={quests}
            recommendedProject={
              recommendedProject && recommendedProjectImpact
                ? {
                    name: recommendedProject.name_default ?? 'Projet biodiversite',
                    description:
                      recommendedProject.description_default ??
                      'Un projet concret pour proteger le vivant.',
                    href: recommendedProject.slug
                      ? `/projects/${recommendedProject.slug}`
                      : '/projects',
                    location: projectLocation || 'Terrain partenaire',
                    imageUrl: recommendedProject.hero_image_url,
                    fundingProgress: Math.min(Math.max(projectProgress, 0), 100),
                    typeLabel:
                      recommendedProject.type === 'donation' ? 'Action terrain' : 'Soutien producteur',
                    speciesName: linkedSpecies?.name_default ?? null,
                    impactValue: recommendedProjectImpact.value,
                    impactLabel: recommendedProjectImpact.label,
                    impactKind: recommendedProjectImpact.kind,
                  }
                : null
            }
            featuredSpecies={
              linkedSpecies
                ? {
                    name: linkedSpecies.name_default,
                    scientificName: linkedSpecies.scientific_name,
                    imageUrl: linkedSpecies.image_url,
                    conservationStatus: linkedSpecies.conservation_status,
                    isUnlocked: Boolean(linkedSpecies.user_status?.isUnlocked),
                    href: '/profile/biodex',
                  }
                : null
            }
            collectiveProgress={getSeasonProgress()}
            impactPoints={impactPoints}
          />
        </Suspense>
      </div>
    </TabScreen>
  )
}
