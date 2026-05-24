import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const webClientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const readSource = (relativePath: string) => {
  const filePath = path.join(webClientRoot, relativePath)
  if (!existsSync(filePath)) {
    throw new Error(`${relativePath} should exist`)
  }
  return readFileSync(filePath, 'utf8')
}

const expectNoMatches = (source: string, patterns: RegExp[], label: string) => {
  const matches = patterns.flatMap((pattern) => source.match(pattern) ?? [])
  if (matches.length > 0) {
    throw new Error(`${label}: ${matches.join(', ')}`)
  }
  expect(matches).toEqual([])
}

describe('V1 mobile prototype UX guardrails', () => {
  it('does not expose the legacy seeds wallet on mobile prototype surfaces', () => {
    const renderedSurfaces = [
      'src/app/[locale]/(screens)/academy/page.tsx',
      'src/app/[locale]/(screens)/academy/out-of-lives/page.tsx',
      'src/app/[locale]/(screens)/academy/[chapter]/[unit]/page.tsx',
      'src/app/[locale]/(screens)/onboarding/_features/step-1-quiz.tsx',
      'src/app/[locale]/(screens)/onboarding/_features/paywall-card.tsx',
      'src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx',
      'src/app/[locale]/(tabs)/profile/_features/authenticated-profile.tsx',
      'src/app/[locale]/(screens)/profile/[id]/mock-public-profile.tsx',
      'src/app/[locale]/(screens)/profile/contributions/_features/transaction-receipt.tsx',
      'src/app/[locale]/(site)/(home)/_components/sections/home-gamification-section.tsx',
      'src/app/[locale]/(screens)/impact/_features/impact-tab-client.tsx',
      'src/app/[locale]/(screens)/impact/reward/page.tsx',
      'src/app/[locale]/(screens)/impact/sanctuary/[faction]/_components/sanctuary-content.tsx',
    ]

    for (const surface of renderedSurfaces) {
      expectNoMatches(readSource(surface), [/\/profile\/seeds/g, /\b[Gg]raines?\b/g], surface)
    }
  })

  it('does not expose Academy reward labels as seeds', () => {
    const academyRewardSources = [
      'src/app/[locale]/(screens)/academy/_lib/runtime.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/boss.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/life-factory.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/photosynthesis.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/reflexes.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/soil.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/sun.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-1/water.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-2/alliances.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-2/mutations.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-2/predators.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-3/carbon.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-3/pollination.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-3/water-cycle-deep.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-4/corals.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-4/madagascar.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-4/seasons.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-5/extinctions.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-5/permaculture.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-5/ruchers-antsirabe.ts',
      'src/app/[locale]/(screens)/academy/_lib/content/units/chapter-5/solutions.ts',
    ]

    for (const source of academyRewardSources) {
      expectNoMatches(readSource(source), [/\bGraines\b/g], source)
    }
  })

  it('keeps investment wording out of rendered learning content', () => {
    const learningContent = readSource(
      'src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_lib/antsirabe-course-variants.ts',
    )

    expectNoMatches(learningContent, [/\binvesti[a-zéèê]*\b/gi], 'Antsirabe learning content')
  })

  it('keeps checkout flows mock-first without Supabase or Stripe in the rendered path', () => {
    const checkoutServerPages = [
      'src/app/[locale]/(screens)/projects/[slug]/contribute/page.tsx',
      'src/app/[locale]/(screens)/projects/[slug]/support/page.tsx',
      'src/app/[locale]/@modal/(.)projects/[slug]/contribute/page.tsx',
      'src/app/[locale]/@modal/(.)projects/[slug]/support/page.tsx',
    ]

    for (const page of checkoutServerPages) {
      expectNoMatches(readSource(page), [/createClient/g, /@\/lib\/supabase/g], page)
    }

    const supportFlow = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx',
    )
    expectNoMatches(supportFlow, [/@stripe\//g, /loadStripe/g, /PaymentElement/g], 'support flow')
  })

  it('keeps checkout wording and contribution rewards coherent in the mobile prototype', () => {
    const supportFlow = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx',
    )
    expectNoMatches(
      supportFlow,
      [/Votre contribution aide ce producteur/g],
      'support checkout body wording',
    )

    const contributeFlow = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx',
    )
    expectNoMatches(
      contributeFlow,
      [/projects\.donate_page/g, /La Chouette Effraie/g],
      'contribution checkout i18n and species fallback',
    )
  })

  it('applies the documented V1 checkout rules before real payments are enabled', () => {
    const supportFlow = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx',
    )
    expect(supportFlow.includes('bonus_percentage: 0')).toBe(true)
    expect(supportFlow.includes('showSpeciesCard={false}')).toBe(true)
    expect(supportFlow.includes('const checkoutSpecies: ProjectSpecies[] = []')).toBe(true)
    expectNoMatches(supportFlow, [/bonus_percentage: rules\.expected_bonus/g], 'support credits rule')

    const contributeFlow = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx',
    )
    expect(contributeFlow.includes('showSpeciesCard={false}')).toBe(true)
    expect(contributeFlow.includes('const hasSpecies = false')).toBe(true)

    const paymentBreakdown = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/_components/shared/payment-breakdown.tsx',
    )
    expect(paymentBreakdown.includes('const DEFAULT_SUPPORT_PLATFORM_FEE_RATE = 0.12')).toBe(true)
    expect(paymentBreakdown.includes('Conditions et remboursements')).toBe(true)
    expectNoMatches(
      paymentBreakdown,
      [/seller-of-record/g, /marchand de référence/g],
      'unvalidated payment responsibility wording',
    )
  })

  it('protects partner advantage redemption with a visible mock Credits Impact debit', () => {
    const detailPage = readSource('src/app/[locale]/(screens)/advantages/[id]/page.tsx')
    const modalPage = readSource('src/app/[locale]/@modal/(.)advantages/[id]/page.tsx')
    const detail = readSource(
      'src/app/[locale]/(screens)/advantages/[id]/_features/advantage-detail.tsx',
    )

    expect(detailPage.includes('getCurrentProfile')).toBe(true)
    expect(detailPage.includes('initialImpactCredits')).toBe(true)
    expect(modalPage.includes('getCurrentProfile')).toBe(true)
    expect(detail.includes('isConnected')).toBe(true)
    expect(
      detail.includes('const hasEnoughImpactCredits = impactCreditsBalance >= advantage.priceCredits'),
    ).toBe(true)
    expect(detail.includes('!hasEnoughImpactCredits')).toBe(true)
    expect(detail.includes('Confirmer l’utilisation')).toBe(true)
    expect(
      detail.includes('setImpactCreditsBalance((balance) => balance - advantage.priceCredits)'),
    ).toBe(true)
    expect(detail.includes('returnTo=')).toBe(true)
  })

  it('shows seller responsibility and product conditions before prototype payment', () => {
    const productPayment = readSource(
      'src/app/[locale]/(screens)/products/[id]/_features/product-fiat-checkout-view.tsx',
    )

    expect(productPayment.includes('Vendeur et expéditeur')).toBe(true)
    expect(productPayment.includes('Conditions, retours et SAV')).toBe(true)
    expect(productPayment.includes('droit de rétractation')).toBe(true)
    expect(productPayment.includes('paiements réels')).toBe(true)
  })

  it('keeps project discovery mock-only and loads the map only after user intent', () => {
    const projectsDataSource = readSource('src/app/[locale]/(tabs)/projects/_features/get-projects.ts')
    expectNoMatches(projectsDataSource, [/createStaticClient/g, /from\('public_projects'\)/g], 'projects data source')

    const projectsClient = readSource('src/app/[locale]/(tabs)/projects/projects-client.tsx')
    expectNoMatches(
      projectsClient,
      [/requestIdleCallback/g, /setTimeout\(\(\) => setShouldMountMap\(true\)/g],
      'projects map preload',
    )
  })

  it('keeps project detail mock-only and avoids nested interactive CTA markup', () => {
    const detailPage = readSource('src/app/[locale]/(screens)/projects/[slug]/page.tsx')
    expectNoMatches(detailPage, [/getProjectContext/g], 'project detail page')

    const detailData = readSource('src/app/[locale]/(screens)/projects/[slug]/project-detail-data.ts')
    expectNoMatches(
      detailData,
      [/isMockDataSource/g, /createStaticClient/g, /from\('public_projects'\)/g],
      'project detail data source',
    )

    const speciesData = readSource('src/app/[locale]/(screens)/projects/_api/project-species.service.ts')
    expectNoMatches(
      speciesData,
      [/isMockDataSource/g, /createStaticClient/g, /from\('v_species_context'\)/g],
      'project species data source',
    )

    const quickView = readSource('src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx')
    expectNoMatches(
      quickView,
      [/<Link href=\{supportPath\}[\s\S]{0,240}<Button/g],
      'project detail primary CTA',
    )
  })
})
