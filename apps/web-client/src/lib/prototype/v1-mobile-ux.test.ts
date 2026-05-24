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
      'src/app/[locale]/(screens)/projects/[slug]/donate/_components/project-donate-one-flow.tsx',
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
      'src/app/[locale]/(screens)/projects/[slug]/donate/page.tsx',
      'src/app/[locale]/(screens)/projects/[slug]/support/page.tsx',
      'src/app/[locale]/@modal/(.)projects/[slug]/donate/page.tsx',
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
})
