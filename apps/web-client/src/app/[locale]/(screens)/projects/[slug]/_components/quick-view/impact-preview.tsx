import Image from 'next/image'
import type { ComponentType, CSSProperties } from 'react'
import {
  Activity,
  ArrowRight,
  Bug,
  CalendarDays,
  ChevronDown,
  Cloud,
  Droplet,
  Fish,
  Flower2,
  Grid2x2,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TreePine,
  Waves,
} from 'lucide-react'
import type { ImpactIconKey, ProjectImpactItem } from '../../_utils/build-project-impact-items'
import type { SupportRewardTier } from '@/app/[locale]/(screens)/projects/_types/project'
import { HiveSilhouette } from '@/lib/impact-icons'
import { sanitizeImageUrl } from '@/lib/image-url'
import type { ProjectUpdate } from '@/types/project'

type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>

const ICON_MAP: Record<ImpactIconKey, IconComponent> = {
  hives: HiveSilhouette,
  bees: Bug,
  honey: Droplet,
  flowers: Flower2,
  co2: Cloud,
  tree: TreePine,
  oil: Droplet,
  coral: Waves,
  area: Grid2x2,
  fish: Fish,
  survival: Activity,
}

type ProjectImpactPreviewProps = {
  items: ProjectImpactItem[]
  accentColor: string
  projectType?: string | null
  latestUpdate?: ProjectUpdate | null
  supportRewardTiers?: SupportRewardTier[]
}

function ImpactValue({ item, size = 'md' }: { item: ProjectImpactItem; size?: 'lg' | 'md' }) {
  return (
    <p
      className={
        size === 'lg'
          ? 'text-5xl font-black leading-none tracking-tight text-white tabular-nums'
          : 'text-2xl font-black leading-none tracking-tight text-white tabular-nums'
      }
    >
      {item.value}
      {item.unit ? (
        <span className={size === 'lg' ? 'ml-1 text-2xl font-bold text-white/45' : 'ml-1 text-lg font-bold text-white/45'}>
          {item.unit}
        </span>
      ) : null}
    </p>
  )
}

function MethodDetails({ item }: { item: ProjectImpactItem }) {
  return (
    <details className="group mt-4 border-t border-white/[0.06] pt-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-white/30 transition-colors hover:text-white/50">
        Methode et limites
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3 space-y-2.5">
        <div className="grid gap-1.5 sm:grid-cols-[84px_1fr] sm:gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            Methode
          </span>
          <p className="text-[12px] leading-relaxed text-white/50">{item.estimate}</p>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-[84px_1fr] sm:gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            Limite
          </span>
          <p className="text-[12px] leading-relaxed text-white/50">{item.caution}</p>
        </div>
      </div>
    </details>
  )
}

function ImpactHero({ item, accentColor }: { item: ProjectImpactItem; accentColor: string }) {
  const Icon = ICON_MAP[item.iconKey]
  const isSensitive = item.iconKey === 'co2'

  return (
    <section className="border-b border-white/[0.08] pb-6">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/[0.055]">
          <Icon className="h-6 w-6" style={{ color: accentColor }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              Impact principal
            </p>
            <span
              className={
                isSensitive
                  ? 'rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-300/70'
                  : 'rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-black text-white/35'
              }
            >
              {isSensitive ? 'Estimation sensible' : 'Estimation terrain'}
            </span>
          </div>
          {item.prefix ? (
            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white/35">
              {item.prefix}
            </p>
          ) : null}
          <div className={item.prefix ? 'mt-1' : 'mt-4'}>
            <ImpactValue item={item} size="lg" />
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{item.label}</h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/58">{item.meaning}</p>
        </div>
      </div>
      <MethodDetails item={item} />
    </section>
  )
}

function ImpactLine({ item, accentColor }: { item: ProjectImpactItem; accentColor: string }) {
  const Icon = ICON_MAP[item.iconKey]
  const isSensitive = item.iconKey === 'co2'

  return (
    <article className="border-b border-white/[0.08] py-5 last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.045]">
          <Icon className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/25">
                {item.group}
              </p>
              <h3 className="mt-1 text-[15px] font-black leading-tight text-white">{item.label}</h3>
            </div>
            <div className="shrink-0 text-right">
              {item.prefix ? (
                <p className="mb-1 text-[10px] font-bold text-white/30">{item.prefix}</p>
              ) : null}
              <ImpactValue item={item} />
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-white/55">{item.meaning}</p>
          {isSensitive ? (
            <p className="mt-2 text-[11px] font-bold text-amber-300/60">
              A lire comme ordre de grandeur, pas comme compensation certifiee.
            </p>
          ) : null}
          <MethodDetails item={item} />
        </div>
      </div>
    </article>
  )
}

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
  reassurance,
}: {
  item: ProjectImpactItem
  caption: string
  accentColor: string
  reassurance?: string
}) {
  const Icon = ICON_MAP[item.iconKey]

  return (
    <article className="border-b border-white/[0.075] py-4 last:border-b-0">
      <div className="grid grid-cols-[42px_minmax(0,1fr)] items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.045]">
          <Icon className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/28">
                {item.group}
              </p>
              <h3 className="mt-1 text-[17px] font-black leading-tight text-white">{item.label}</h3>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/[0.045] px-3 py-2 text-right">
              {item.prefix ? <p className="mb-1 text-[10px] font-bold text-white/32">{item.prefix}</p> : null}
              <ImpactValue item={item} />
            </div>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/56">{caption}</p>
          {reassurance ? (
            <p className="mt-2 text-[11px] font-bold leading-relaxed text-white/36">{reassurance}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

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
    <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3 border-b border-white/[0.07] py-3 last:border-b-0">
      <p className="pt-0.5 text-[19px] font-black tabular-nums text-lime-300">{amount} €</p>
      <div className="min-w-0">
        <p className="text-[14px] font-black leading-tight text-white">{title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/52">
          {tier?.impactSummary || description}
        </p>
        {tier?.rewardLabel ? (
          <p className="mt-1.5 text-[11px] font-bold leading-relaxed text-amber-300/72">
            Contrepartie optionnelle : {tier.rewardLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function formatUpdateDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(iso))
  } catch {
    return ''
  }
}

function TerrainProofCard({ update }: { update: ProjectUpdate | null | undefined }) {
  if (!update) return null
  const imageUrl = sanitizeImageUrl(update.imageUrl)

  return (
    <section className="mt-8 border-t border-white/[0.08] pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Preuve terrain
          </p>
          <h3 className="mt-1.5 text-xl font-black leading-tight text-white">
            Sur place, récemment
          </h3>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.032]">
        {imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={imageUrl} alt={update.title} fill sizes="390px" className="object-cover" />
          </div>
        ) : null}
        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/36">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={update.postedAt}>{formatUpdateDate(update.postedAt)}</time>
          </div>
          <h3 className="mt-2 text-lg font-black leading-tight text-white">{update.title}</h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/54">{update.body}</p>
          {update.authorName ? (
            <p className="mt-3 text-[12px] font-bold text-white/40">{update.authorName}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

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
      <div className="rounded-[1.35rem] border border-white/[0.08] bg-[radial-gradient(circle_at_18%_0%,rgba(190,242,100,0.13),transparent_32%),rgba(255,255,255,0.032)] p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-300/10">
            <ShieldCheck className="h-4 w-4 text-lime-300" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
              Impact terrain
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <p className="text-6xl font-black leading-none tracking-tight text-white tabular-nums">
            {hives.value}
          </p>
          <h2 className="pb-1 text-[27px] font-black leading-[0.95] tracking-tight text-white">
            ruches accompagnées
          </h2>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-white/64">
          Le soutien finance le suivi des colonies, l’équipement apicole et la valorisation du miel avec les apiculteurs locaux.
        </p>
        <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] font-bold leading-relaxed text-white/38">
          Estimation évolutive, basée sur le budget collecté et les conditions locales.
        </p>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
              Ce que ça change
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/44">
              Les effets lisibles du projet, du rucher à la filière.
            </p>
          </div>
        </div>
        <div className="mt-4 border-y border-white/[0.08]">
          <ImpactMiniMetric
            item={hives}
            accentColor={accentColor}
            caption="Des colonies suivies plus régulièrement, avec du matériel adapté au terrain."
          />
          <article className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-3 border-b border-white/[0.075] py-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.045]">
              <PackageCheck className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/28">
                Producteurs
              </p>
              <h3 className="mt-1 text-[17px] font-black leading-tight text-white">
                Apiculteurs mieux équipés
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/56">
                Plus de moyens pour inspecter les ruches, récolter proprement et mieux valoriser leur travail.
              </p>
            </div>
          </article>
          {honey ? (
            <ImpactMiniMetric
              item={honey}
              accentColor={accentColor}
              caption="Une récolte locale mieux collectée, préparée et vendue avec le partenaire."
              reassurance="Potentiel de récolte, pas une promesse de rendement."
            />
          ) : null}
          {flowers ? (
            <ImpactMiniMetric
              item={flowers}
              accentColor={accentColor}
              caption="Une activité de pollinisation utile aux cultures et à la biodiversité autour des ruchers."
              reassurance="Ordre de grandeur, pas un comptage individuel."
            />
          ) : null}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-lime-300" aria-hidden="true" />
            <h3 className="text-lg font-black text-white">Votre soutien devient concret</h3>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-white/42">
          Trois repères simples pour comprendre ce que finance chaque palier.
        </p>
        <div className="mt-3">
          <SupportAmountRow
            amount={30}
            title="Suivi terrain"
            description="Participe au suivi terrain et à l’accompagnement des apiculteurs."
            tier={tier30}
          />
          <SupportAmountRow
            amount={60}
            title="Ruche accompagnée"
            description="Contribue à une ruche accompagnée et inclut une contrepartie miel optionnelle."
            tier={tier60}
          />
          <SupportAmountRow
            amount={120}
            title="Pack producteur"
            description="Renforce l’équipement, le suivi et la valorisation du miel produit."
            tier={tier120}
          />
        </div>
      </section>

      <TerrainProofCard update={latestUpdate} />

      <details className="group mt-8 border-y border-white/[0.08] py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-black text-white">
          Comment lire ces estimations
          <ChevronDown
            className="h-4 w-4 shrink-0 text-white/35 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
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

export function ProjectImpactPreview({
  items,
  accentColor,
  projectType = null,
  latestUpdate = null,
  supportRewardTiers = [],
}: ProjectImpactPreviewProps) {
  const hasBeehiveImpact = projectType === 'beehive' && items.some((item) => item.id === 'hives')

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
    <section>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Ce que le projet permet
      </p>
      <ImpactHero item={leadItem} accentColor={accentColor} />

      {remainingItems.length > 0 ? (
        <div className="mt-2">
          {remainingItems.map((item) => (
            <ImpactLine key={item.id} item={item} accentColor={accentColor} />
          ))}
        </div>
      ) : null}

      <p className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] leading-relaxed text-white/30">
        Ces estimations donnent des ordres de grandeur bases sur des hypotheses documentees. Elles
        ne constituent pas une mesure certifiee ni une promesse de resultat.
      </p>
    </section>
  )
}
