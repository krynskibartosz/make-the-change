# Mobile Project Impact Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the mobile `Impact` tab on project detail pages so beehive projects read as a premium terrain-proof story: concrete, credible, conversion-aware, and lighter than the current metrics dashboard.

**Architecture:** Keep the existing impact metric engine unchanged. Add a beehive-specific presentation path inside `ProjectImpactPreview`, pass the latest project update and support tiers from `ProjectQuickView`, and make the sticky CTA label contextual so the Impact tab says `Voir les contreparties`. Keep reef/orchard impact rendering on the current generic layout to avoid changing unrelated project types in this pass.

**Tech Stack:** Next.js App Router, React Server Components plus client tabs, TypeScript, Tailwind CSS, lucide-react, Vitest for pure helpers, Playwright for mobile visual verification.

---

## File Structure

- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/impact-preview.tsx`
  - Owns the visual layout of the `Impact` tab.
  - Add a beehive-specific mobile-first story layout.
  - Keep existing generic layout for non-beehive projects.

- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`
  - Pass `supportRewardTiers` and latest project update into `ProjectImpactPreview`.
  - Pass contextual CTA labels into `ProjectDetailTabs`.

- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`
  - Use a pure CTA label helper.
  - Show `Voir les contreparties` when active tab is `impact` for support projects.

- Create: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.ts`
  - Pure helper for active-tab CTA wording.

- Create: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts`
  - Tests support/contribution/closed CTA labels.

- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/build-project-impact-items.ts`
  - Improve beehive wording only.
  - Keep metric values and ids stable.

- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts`
  - Add assertions that beehive ratios still produce expected numbers.

---

### Task 1: Add Pure CTA Label Helper

**Files:**
- Create: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.ts`
- Create: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts`
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`

- [ ] **Step 1: Write the failing CTA helper test**

Create `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getProjectDetailCtaLabel } from './project-detail-cta'

describe('getProjectDetailCtaLabel', () => {
  it('returns the closed label when funding is closed', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: true,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Projet finance')
  })

  it('uses softer support wording on the impact tab', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: false,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Voir les contreparties')
  })

  it('keeps contribution wording for donation projects', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'impact',
        isFundingClosed: false,
        isContributionProject: true,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Contribuer au projet')
  })

  it('keeps the direct support label on the rewards tab', () => {
    expect(
      getProjectDetailCtaLabel({
        activeTab: 'rewards',
        isFundingClosed: false,
        isContributionProject: false,
        closedLabel: 'Projet finance',
        contributionCtaLabel: 'Contribuer au projet',
        supportCtaLabel: 'Choisir une contrepartie',
      }),
    ).toBe('Choisir une contrepartie')
  })
})
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
pnpm --filter @make-the-change/web-client exec vitest run "src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts"
```

Expected: fail because `project-detail-cta.ts` does not exist.

- [ ] **Step 3: Implement the helper**

Create `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.ts`:

```ts
import type { ProjectDetailTabId } from '../_components/project-detail-tabs'

type ProjectDetailCtaLabelInput = {
  activeTab: ProjectDetailTabId
  isFundingClosed: boolean
  isContributionProject: boolean
  closedLabel: string
  contributionCtaLabel: string
  supportCtaLabel: string
}

export function getProjectDetailCtaLabel({
  activeTab,
  isFundingClosed,
  isContributionProject,
  closedLabel,
  contributionCtaLabel,
  supportCtaLabel,
}: ProjectDetailCtaLabelInput): string {
  if (isFundingClosed) return closedLabel
  if (isContributionProject) return contributionCtaLabel
  if (activeTab === 'impact') return 'Voir les contreparties'
  return supportCtaLabel
}
```

- [ ] **Step 4: Wire the helper into ProjectDetailTabs**

Modify `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`:

```tsx
import { getProjectDetailCtaLabel } from '../_utils/project-detail-cta'
```

Inside `ProjectDetailTabs`, after `activeContent`:

```tsx
  const ctaLabel = getProjectDetailCtaLabel({
    activeTab,
    isFundingClosed,
    isContributionProject,
    closedLabel,
    contributionCtaLabel,
    supportCtaLabel,
  })
```

Replace disabled button content:

```tsx
            {ctaLabel}
```

Replace active button content:

```tsx
            {ctaLabel}
```

- [ ] **Step 5: Run CTA test**

Run:

```bash
pnpm --filter @make-the-change/web-client exec vitest run "src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts"
```

Expected: pass.

---

### Task 2: Improve Beehive Impact Copy

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/build-project-impact-items.ts`
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts`

- [ ] **Step 1: Add test coverage for current beehive display values**

Append to `project-impact-metrics.test.ts`:

```ts
  it('calculates current Antsirabe-style beehive impact values from funding amount', () => {
    const metrics = getProjectImpactMetrics({
      amount: 7640,
      projectType: 'beehive',
      projectImpact: {
        co2Absorbed: null,
        biodiversityGain: null,
        jobsCreated: null,
        timeline: null,
        hivesPerEur: 0.0008,
        beesPerEur: 152,
        honeyGramsPerEur: 7.7,
        flowersPerEur: 1154,
        co2GramsPerEur: 38.5,
      },
    })

    if (metrics.kind !== 'bees') {
      throw new Error(`Expected bee metrics, got ${metrics.kind}`)
    }

    expect(metrics.hivesSupported).toBe(6)
    expect(Math.round(metrics.honeyKg)).toBe(59)
    expect(metrics.flowers).toBeGreaterThan(8_000_000)
  })
```

- [ ] **Step 2: Run metric test**

Run:

```bash
pnpm --filter @make-the-change/web-client exec vitest run "src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts"
```

Expected: pass before copy changes.

- [ ] **Step 3: Replace beehive item wording**

In `build-project-impact-items.ts`, update only the `metrics.kind === 'bees'` item copy:

```ts
    items.push({
      id: 'hives',
      label: 'Ruches accompagnées',
      value: String(metrics.hivesSupported),
      group: 'Soutien terrain',
      iconKey: 'hives',
      main: true,
      meaning: 'Du suivi terrain et du matériel pour accompagner les ruches dans la durée.',
      estimate: 'Estimation basée sur le coût de suivi terrain par ruche accompagnée.',
      caution: 'Le nombre réel dépend du terrain, de la saison et des pratiques apicoles.',
    })
```

For `honey`:

```ts
        meaning: 'Une production locale mieux collectée, préparée et valorisée avec le partenaire.',
        estimate: 'Estimation basée sur le potentiel de production moyen par euro engagé.',
        caution:
          "Ce n'est pas une promesse de récolte. La production dépend des conditions climatiques et sanitaires.",
```

For `flowers`:

```ts
        label: 'Fleurs pollinisées',
        meaning: 'Des abeilles actives autour des ruchers, utiles aux cultures et à la biodiversité locale.',
        estimate: "Estimation basée sur l'activité moyenne de pollinisation associée aux ruches.",
        caution:
          "Ce chiffre donne un ordre de grandeur à l'échelle du projet, pas une mesure individualisée.",
```

For `bees`, keep available for non-primary details but use softer copy:

```ts
        meaning: "Estimation des abeilles rattachées aux ruches accompagnées par le projet.",
```

For `co2`, keep the item for backward compatibility but make it less central through the presentation layer in Task 3.

- [ ] **Step 4: Run metric tests again**

Run:

```bash
pnpm --filter @make-the-change/web-client exec vitest run "src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts"
```

Expected: pass; only wording changed.

---

### Task 3: Build the Beehive Mobile Impact Story Layout

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/impact-preview.tsx`

- [ ] **Step 1: Update imports and props**

Add imports:

```tsx
import Image from 'next/image'
import { ArrowRight, CalendarDays, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'
import type { SupportRewardTier } from '@/app/[locale]/(screens)/projects/_types/project'
import type { ProjectUpdate } from '@/types/project'
```

Update props:

```tsx
type ProjectImpactPreviewProps = {
  items: ProjectImpactItem[]
  accentColor: string
  latestUpdate?: ProjectUpdate | null
  supportRewardTiers?: SupportRewardTier[]
}
```

- [ ] **Step 2: Add local helpers**

Add above `ProjectImpactPreview`:

```tsx
function findImpactItem(items: ProjectImpactItem[], id: string): ProjectImpactItem | null {
  return items.find((item) => item.id === id) ?? null
}

function getTierByAmount(tiers: SupportRewardTier[] | undefined, amount: number): SupportRewardTier | null {
  return tiers?.find((tier) => tier.amount === amount) ?? null
}

function ImpactMiniMetric({
  item,
  caption,
  accentColor,
}: {
  item: ProjectImpactItem
  caption: string
  accentColor: string
}) {
  const Icon = ICON_MAP[item.iconKey]

  return (
    <article className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-start gap-3 border-b border-white/[0.075] py-4 last:border-b-0">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.045]">
        <Icon className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/28">
          {item.group}
        </p>
        <h3 className="mt-1 text-[16px] font-black leading-tight text-white">{item.label}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/52">{caption}</p>
      </div>
      <div className="pt-4 text-right">
        {item.prefix ? <p className="mb-1 text-[10px] font-bold text-white/32">{item.prefix}</p> : null}
        <ImpactValue item={item} />
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Add support amount rows**

Add below `ImpactMiniMetric`:

```tsx
function SupportAmountRow({
  amount,
  title,
  description,
  tier,
}: {
  amount: number
  title: string
  description: string
  tier: SupportRewardTier | null
}) {
  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-white/[0.07] py-3 last:border-b-0">
      <p className="text-xl font-black tabular-nums text-lime-300">{amount} €</p>
      <div>
        <p className="text-[13px] font-black text-white">{title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/48">
          {tier?.impactSummary || description}
        </p>
        {tier?.rewardLabel ? (
          <p className="mt-1.5 text-[11px] font-bold text-amber-300/72">
            Contrepartie optionnelle : {tier.rewardLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add latest update preview**

Add below `SupportAmountRow`:

```tsx
function TerrainProofCard({ update }: { update: ProjectUpdate | null | undefined }) {
  if (!update) return null

  return (
    <section className="mt-8 border-t border-white/[0.08] pt-6">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Sur le terrain récemment
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
        {update.imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={update.imageUrl} alt={update.title} fill sizes="390px" className="object-cover" />
          </div>
        ) : null}
        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/36">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={update.postedAt}>
              {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(update.postedAt))}
            </time>
          </div>
          <h3 className="mt-2 text-lg font-black leading-tight text-white">{update.title}</h3>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/52">{update.body}</p>
          {update.authorName ? (
            <p className="mt-3 text-[12px] font-bold text-white/36">{update.authorName}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Add beehive story component**

Add below `TerrainProofCard`:

```tsx
function BeehiveImpactStory({
  items,
  accentColor,
  latestUpdate,
  supportRewardTiers,
}: {
  items: ProjectImpactItem[]
  accentColor: string
  latestUpdate?: ProjectUpdate | null
  supportRewardTiers?: SupportRewardTier[]
}) {
  const hives = findImpactItem(items, 'hives')
  const honey = findImpactItem(items, 'honey')
  const flowers = findImpactItem(items, 'flowers')
  const bees = findImpactItem(items, 'bees')

  if (!hives) return null

  const tier30 = getTierByAmount(supportRewardTiers, 30)
  const tier60 = getTierByAmount(supportRewardTiers, 60)
  const tier120 = getTierByAmount(supportRewardTiers, 120)

  return (
    <section>
      <div className="rounded-[1.35rem] border border-white/[0.08] bg-[radial-gradient(circle_at_20%_0%,rgba(190,242,100,0.14),transparent_34%),rgba(255,255,255,0.035)] p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-lime-300" aria-hidden="true" />
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/36">
            Impact terrain
          </p>
          <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] font-black text-white/40">
            Estimation
          </span>
        </div>
        <div className="mt-5 flex items-end gap-3">
          <p className="text-7xl font-black leading-none tracking-tight text-white tabular-nums">
            {hives.value}
          </p>
          <h2 className="pb-1 text-2xl font-black leading-none tracking-tight text-white">
            ruches accompagnées
          </h2>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-white/66">
          Votre soutien finance le suivi des colonies, l’équipement apicole et la valorisation du miel produit avec les apiculteurs locaux.
        </p>
      </div>

      <section className="mt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Ce que ça change
        </p>
        <div className="mt-3 border-y border-white/[0.08]">
          <ImpactMiniMetric item={hives} accentColor={accentColor} caption="Du suivi terrain et du matériel pour accompagner les ruches dans la durée." />
          <article className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-3 border-b border-white/[0.075] py-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.045]">
              <PackageCheck className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/28">
                Producteurs
              </p>
              <h3 className="mt-1 text-[16px] font-black leading-tight text-white">
                Apiculteurs mieux équipés
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/52">
                Plus de moyens pour suivre les colonies, récolter le miel et valoriser leur travail.
              </p>
            </div>
          </article>
          {honey ? <ImpactMiniMetric item={honey} accentColor={accentColor} caption="Une production locale mieux collectée, préparée et valorisée avec le partenaire." /> : null}
          {flowers ? <ImpactMiniMetric item={flowers} accentColor={accentColor} caption="Des abeilles actives autour des ruchers, utiles aux cultures et à la biodiversité locale." /> : null}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lime-300" aria-hidden="true" />
          <h3 className="text-lg font-black text-white">Votre soutien devient concret</h3>
        </div>
        <div className="mt-3">
          <SupportAmountRow amount={30} title="Suivi terrain" description="Participe au suivi terrain et à l’accompagnement des apiculteurs." tier={tier30} />
          <SupportAmountRow amount={60} title="Ruche accompagnée" description="Contribue à une ruche accompagnée et inclut une contrepartie miel optionnelle." tier={tier60} />
          <SupportAmountRow amount={120} title="Pack producteur" description="Renforce l’équipement, le suivi et la valorisation du miel produit." tier={tier120} />
        </div>
      </section>

      <TerrainProofCard update={latestUpdate} />

      <details className="group mt-8 border-y border-white/[0.08] py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-black text-white">
          Comment lire ces estimations
          <ChevronDown className="h-4 w-4 shrink-0 text-white/35 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-white/48">
          <p>
            Ces chiffres sont des estimations terrain. Ils aident à comprendre l’ordre de grandeur du projet, sans promettre un résultat exact.
          </p>
          {bees ? <p>{bees.estimate}</p> : null}
        </div>
      </details>
    </section>
  )
}
```

- [ ] **Step 6: Route beehive projects to the new story layout**

Modify `ProjectImpactPreview`:

```tsx
export function ProjectImpactPreview({
  items,
  accentColor,
  latestUpdate = null,
  supportRewardTiers = [],
}: ProjectImpactPreviewProps) {
  const hasBeehiveImpact = items.some((item) => item.id === 'hives')

  if (hasBeehiveImpact) {
    return (
      <BeehiveImpactStory
        items={items}
        accentColor={accentColor}
        latestUpdate={latestUpdate}
        supportRewardTiers={supportRewardTiers}
      />
    )
  }

  const mainItems = items.filter((item) => item.main)
  const leadItem = mainItems[0] ?? items[0]
  if (!leadItem) return null

  const remainingItems = items.filter((item) => item.id !== leadItem.id)

  return (
    // keep the current generic return body unchanged
  )
}
```

Keep the existing generic return body exactly as it is after the beehive early return.

---

### Task 4: Pass Latest Update and Support Tiers Into Impact Preview

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`

- [ ] **Step 1: Compute project updates once**

In `ProjectQuickView`, near `impactItems`, add:

```tsx
  const projectUpdates = getProjectUpdates(project.slug)
  const latestProjectUpdate = projectUpdates[0] ?? null
```

- [ ] **Step 2: Pass new props to ProjectImpactPreview**

Replace:

```tsx
            <ProjectImpactPreview items={impactItems} accentColor={glowRgba(1)} />
```

With:

```tsx
            <ProjectImpactPreview
              items={impactItems}
              accentColor={glowRgba(1)}
              latestUpdate={latestProjectUpdate}
              supportRewardTiers={supportRewardTiers}
            />
```

- [ ] **Step 3: Reuse computed updates in the Updates tab**

Replace:

```tsx
          <ProjectUpdatesFeed updates={getProjectUpdates(project.slug)} />
```

With:

```tsx
          <ProjectUpdatesFeed updates={projectUpdates} />
```

---

### Task 5: Mobile Spacing and CTA Polish

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`

- [ ] **Step 1: Reduce tab panel top spacing only for Impact**

In `project-quick-view.tsx`, change the Impact tab content wrapper from:

```tsx
        <div className="px-4 pt-6 sm:px-5">
```

To:

```tsx
        <div className="px-4 pt-4 sm:px-5">
```

- [ ] **Step 2: Keep bottom padding but avoid visual collision**

In `project-detail-tabs.tsx`, keep:

```tsx
        className="pb-44 sm:pb-48"
```

Do not reduce bottom padding in this pass. The large CTA remains fixed; this plan only softens its label on Impact.

- [ ] **Step 3: Verify tab CTA behavior manually**

Expected on `http://localhost:3001/fr/projects/ruchers-apiculteurs-independants-antsirabe`:

- `Impact` tab bottom CTA: `Voir les contreparties`
- `Contreparties` tab bottom CTA: `Choisir une contrepartie`
- coral/contribution project Impact tab bottom CTA: `Contribuer au projet`

---

### Task 6: Verification

**Files:**
- No source edits.

- [ ] **Step 1: Run focused tests**

Run:

```bash
pnpm --filter @make-the-change/web-client exec vitest run "src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts" "src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts"
```

Expected: all tests pass.

- [ ] **Step 2: Run type-check**

Run:

```bash
pnpm --filter @make-the-change/web-client type-check
```

Expected: command exits `0`.

- [ ] **Step 3: Launch dev server in stable local mode**

If no server is running:

```bash
pnpm --filter @make-the-change/web-client exec next dev --webpack -p 3001
```

Expected: `Local: http://localhost:3001`.

- [ ] **Step 4: Playwright mobile verification**

Use iPhone-sized viewport `390x844` and verify:

```ts
await page.goto('http://localhost:3001/fr/projects/ruchers-apiculteurs-independants-antsirabe')
await page.getByRole('tab', { name: 'Impact' }).click()
await expect(page.getByText('Impact terrain')).toBeVisible()
await expect(page.getByText('6 ruches accompagnées')).toBeVisible()
await expect(page.getByText('Votre soutien devient concret')).toBeVisible()
await expect(page.getByText('Sur le terrain récemment')).toBeVisible()
await expect(page.getByRole('button', { name: 'Voir les contreparties' })).toBeVisible()
```

Capture screenshots:

- `output/playwright/impact-mobile-redesign-top.png`
- `output/playwright/impact-mobile-redesign-mid.png`
- `output/playwright/impact-mobile-redesign-low.png`

- [ ] **Step 5: Visual acceptance checklist**

On iPhone:

- The first visible Impact content starts with `Impact terrain`.
- The main proof reads as a human sentence, not a dashboard.
- The CO₂ metric is not visible in the primary story.
- The latest terrain update appears after support amount rows.
- The fixed CTA does not say `Choisir une contrepartie` on the Impact tab.
- The tab remains sticky below the fixed header.
- No text is hidden behind the bottom CTA when resting after a scroll.

---

### Task 7: Commit and Push

**Files:**
- All modified source/test files.

- [ ] **Step 1: Inspect working tree**

Run:

```bash
git status --short
```

Expected: only the intended Impact/CTA/test files plus any known pre-existing files. Do not stage `.worktrees/` or unrelated Base UI docs/changes.

- [ ] **Step 2: Stage only intended files**

Run:

```bash
git add \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/impact-preview.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.ts" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-detail-cta.test.ts" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/build-project-impact-items.ts" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics.test.ts" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx"
```

- [ ] **Step 3: Commit**

Run:

```bash
git commit -m "feat(project): redesign mobile impact tab"
```

- [ ] **Step 4: Push main**

Run:

```bash
git push origin main
```

Expected: push succeeds and Vercel starts a production deployment.

---

## Self-Review

- Spec coverage: The plan covers the approved direction: terrain proof, concrete impact, support amount connection, latest update proof, single transparency block, softer CTA wording, mobile verification.
- Placeholder scan: No `TBD`, `TODO`, or open-ended “add appropriate” steps remain.
- Type consistency: `ProjectImpactPreviewProps`, `SupportRewardTier`, `ProjectUpdate`, and `ProjectDetailTabId` are named consistently with existing files.
- Scope check: This is one coherent change set focused on the mobile project detail Impact tab. Reef/orchard generic impact rendering is intentionally preserved.
