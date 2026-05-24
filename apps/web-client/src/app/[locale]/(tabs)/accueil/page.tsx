import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { getProjects } from '@/app/[locale]/(tabs)/projects/_features/get-projects'
import { getProjectImpactDisplay } from '@/app/[locale]/(tabs)/projects/_features/project-map-data'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockSupports } from '@/lib/mock/mock-member-data'
import { getCurrentMockImpactCreditsBalance } from '@/lib/mock/mock-member-data-server'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { getLatestProjectUpdate } from '@/lib/mock/mock-project-updates'
import { AccueilTab, type AccueilProjectCard, type SupportedProjectCard } from './_features/adventure-tab'
import { AdventureTabHeader } from './_features/adventure-tab-header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Accueil | Make the Change',
  }
}

const fallbackLoader = (
  <div className="flex h-[40vh] w-full animate-pulse flex-col items-center justify-center gap-4 text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent" />
    <p className="font-medium">Chargement de l&apos;accueil...</p>
  </div>
)

export default async function AccueilPage() {
  await connection()

  const currentViewer = isMockDataSource ? await getCurrentViewer() : null
  const viewerId = currentViewer?.viewerId ?? null
  const faction = currentViewer?.faction ?? null

  const [projects, impactPoints] = await Promise.all([
    getProjects({ status: 'active' }),
    viewerId ? getCurrentMockImpactCreditsBalance(viewerId, faction) : Promise.resolve(0),
  ])

  const supports = viewerId ? getMockSupports(viewerId) : []
  const supportedSlugs = new Set(supports.map((s) => s.project.slug))

  const supportedCards: SupportedProjectCard[] = supports.map((support) => {
    const matched = projects.find((p) => p.slug === support.project.slug)
    const latestUpdate = getLatestProjectUpdate(support.project.slug)
    return {
      id: support.id,
      name: support.project.name_default,
      slug: support.project.slug,
      imageUrl: support.project.cover_image_url,
      fundingProgress: Math.min(Math.max(matched?.funding_progress ?? 0, 0), 100),
      amountSupported: support.amount_eur_equivalent,
      supportedAt: support.created_at,
      href: `/projects/${support.project.slug}`,
      latestUpdate: latestUpdate
        ? {
            title: latestUpdate.title,
            postedAt: latestUpdate.postedAt,
          }
        : null,
    }
  })

  const candidateProject =
    projects.find(
      (project) =>
        project.featured &&
        project.status === 'active' &&
        project.slug &&
        !supportedSlugs.has(project.slug),
    ) ??
    projects.find(
      (project) => project.status === 'active' && project.slug && !supportedSlugs.has(project.slug),
    ) ??
    projects[0] ??
    null

  const recommendedProjectImpact = candidateProject
    ? getProjectImpactDisplay(candidateProject)
    : null

  const recommendedProject: AccueilProjectCard | null =
    candidateProject && recommendedProjectImpact
      ? {
          name: candidateProject.name_default ?? 'Projet biodiversite',
          description:
            candidateProject.description_default ??
            'Un projet concret pour proteger le vivant.',
          href: candidateProject.slug ? `/projects/${candidateProject.slug}` : '/projects',
          location:
            [candidateProject.address_city, candidateProject.address_country_code]
              .filter(Boolean)
              .join(', ') || 'Terrain partenaire',
          imageUrl: candidateProject.hero_image_url,
          fundingProgress: Math.min(Math.max(candidateProject.funding_progress ?? 0, 0), 100),
          typeLabel:
            candidateProject.type === 'donation' ? 'Action terrain' : 'Soutien producteur',
          impactValue: recommendedProjectImpact.value,
          impactLabel: recommendedProjectImpact.label,
        }
      : null

  return (
    <TabScreen
      header={<AdventureTabHeader faction={faction} seeds={0} impactPoints={impactPoints} />}
      className="bg-[#0B0F15]"
      contentClassName="scroll-pt-6"
    >
      <div className="relative w-full">
        <Suspense fallback={fallbackLoader}>
          <AccueilTab
            displayName={currentViewer?.displayName ?? null}
            supportedProjects={supportedCards}
            recommendedProject={recommendedProject}
            impactPoints={impactPoints}
          />
        </Suspense>
      </div>
    </TabScreen>
  )
}
