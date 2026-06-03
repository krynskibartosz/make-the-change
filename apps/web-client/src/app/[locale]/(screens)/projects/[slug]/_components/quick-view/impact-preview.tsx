import type { ComponentType, CSSProperties } from 'react'
import {
  Activity,
  Bug,
  ChevronDown,
  Cloud,
  Droplet,
  Fish,
  Flower2,
  Grid2x2,
  TreePine,
  Waves,
} from 'lucide-react'
import type { ImpactIconKey, ProjectImpactItem } from '../../_utils/build-project-impact-items'
import { HiveSilhouette } from '@/lib/impact-icons'

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
        <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" />
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
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
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
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
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

export function ProjectImpactPreview({ items, accentColor }: ProjectImpactPreviewProps) {
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
