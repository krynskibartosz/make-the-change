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
    expectNoMatches(
      supportFlow,
      [/bonus_percentage: rules\.expected_bonus/g],
      'support credits rule',
    )

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
      detail.includes('const hasEnoughImpactCredits = balance >= advantage.priceCredits'),
    ).toBe(true)
    expect(detail.includes('!hasEnoughImpactCredits')).toBe(true)
    expect(detail.includes('Confirmer l’utilisation')).toBe(true)
    expect(detail.includes('redeemAdvantageAction(advantage.id)')).toBe(true)
    expect(detail.includes('Avantage débloqué')).toBe(true)
    expectNoMatches(detail, [/Code débloqué/g, /Ouvrir le site partenaire/g], 'discount redemption')
    expect(detail.includes('returnTo=')).toBe(true)
  })

  it('uses an image badge rather than discount wording in the advantage title', () => {
    const advantages = readSource(
      'src/app/[locale]/(screens)/advantages/_features/mock-advantages.ts',
    )
    const tab = readSource('src/app/[locale]/(tabs)/advantages/_features/advantages-tab.tsx')
    const catalog = readSource(
      'src/app/[locale]/(screens)/advantages/_features/advantages-catalog-client.tsx',
    )
    const detail = readSource(
      'src/app/[locale]/(screens)/advantages/[id]/_features/advantage-detail.tsx',
    )

    expect(advantages.includes("imageBadge: '-10 %'")).toBe(true)
    expectNoMatches(advantages, [/title: '-10 %/g], 'discount advantage title')
    expect(tab.includes('advantage.imageBadge')).toBe(true)
    expect(catalog.includes('advantage.imageBadge')).toBe(true)
    expect(detail.includes('advantage.imageBadge')).toBe(true)
  })

  it('renders the full advantages catalogue during intercepted mobile navigation', () => {
    const catalogModal = readSource('src/app/[locale]/@modal/(.)advantages/catalog/page.tsx')

    expect(catalogModal.includes('FullScreenSlideModal')).toBe(true)
    expect(catalogModal.includes('AdvantagesCatalogClient')).toBe(true)
    expect(catalogModal.includes('getMockAdvantages')).toBe(true)
    expectNoMatches(catalogModal, [/return null/g], 'intercepted advantages catalogue')
  })

  it('shows seller responsibility and product conditions before prototype payment', () => {
    const productPayment = readSource(
      'src/app/[locale]/(screens)/products/cart/product-cart-client.tsx',
    )

    expect(productPayment.includes('Vendeur et expéditeur')).toBe(true)
    expect(productPayment.includes('Articles')).toBe(true)
    expect(productPayment.includes('Conditions, retours et SAV')).toBe(true)
    expect(productPayment.includes('droit de rétractation')).toBe(true)
    expect(productPayment.includes('Aucun paiement réel')).toBe(true)
    expect(productPayment.includes('Commande liée à ton espace MTC')).toBe(true)
    expect(productPayment.includes('Achat invité')).toBe(true)
  })

  it('keeps the product shop euro-only and mock-only', () => {
    const productsDataSource = readSource(
      'src/app/[locale]/(screens)/products/_features/get-products.ts',
    )
    const productDetailData = readSource(
      'src/app/[locale]/(screens)/products/[id]/product-detail-data.ts',
    )
    const productDetail = readSource(
      'src/app/[locale]/(screens)/products/[id]/product-quick-view.tsx',
    )

    expectNoMatches(
      productsDataSource,
      [/createStaticClient/g, /from\('public_products'\)/g],
      'products data source',
    )
    expectNoMatches(
      productDetailData,
      [/createStaticClient/g, /from\('public_products'\)/g],
      'product detail data source',
    )
    expectNoMatches(
      productDetail,
      [/ProductCheckoutView/g, /displayPoints/g, /Crédits Impact/g],
      'product detail checkout',
    )

    const projectProducts = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/_components/shared/producer-products.tsx',
    )
    expectNoMatches(
      projectProducts,
      [/CurrencyAmount/g, /Crédits Impact/g, /price_points/g],
      'project products',
    )

    const homeProducts = readSource('src/app/[locale]/(site)/(home)/_api/home.server-data.ts')
    expectNoMatches(homeProducts, [/featuredProductsQuery/g, /price_points/g], 'home products')
  })

  it('keeps project discovery mock-only and loads the map only after user intent', () => {
    const projectsDataSource = readSource(
      'src/app/[locale]/(tabs)/projects/_features/get-projects.ts',
    )
    expectNoMatches(
      projectsDataSource,
      [/createStaticClient/g, /from\('public_projects'\)/g],
      'projects data source',
    )

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

    const detailData = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/project-detail-data.ts',
    )
    expectNoMatches(
      detailData,
      [/isMockDataSource/g, /createStaticClient/g, /from\('public_projects'\)/g],
      'project detail data source',
    )

    const speciesData = readSource(
      'src/app/[locale]/(screens)/projects/_api/project-species.service.ts',
    )
    expectNoMatches(
      speciesData,
      [/isMockDataSource/g, /createStaticClient/g, /from\('v_species_context'\)/g],
      'project species data source',
    )

    const quickView = readSource(
      'src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx',
    )
    expectNoMatches(
      quickView,
      [/<Link href=\{supportPath\}[\s\S]{0,240}<Button/g],
      'project detail primary CTA',
    )
  })
})
