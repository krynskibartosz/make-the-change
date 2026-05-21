'use client'

import { useState } from 'react'
import {
  Activity,
  Bug,
  ChevronUp,
  Cloud,
  Droplet,
  Fish,
  Flower2,
  Grid2x2,
  TreePine,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { ImpactIconKey, ProjectImpactItem } from '../../_utils/build-project-impact-items'
import { MobileSheet } from '../shared/mobile-sheet'

const ICON_MAP: Record<ImpactIconKey, LucideIcon> = {
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

function MiniCard({ item, accentColor }: { item: ProjectImpactItem; accentColor: string }) {
  const Icon = ICON_MAP[item.iconKey]
  return (
    <div className="flex flex-col items-start gap-1.5 rounded-2xl bg-white/[0.04] p-3">
      <Icon className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
      {item.prefix ? (
        <span className="text-[10px] font-semibold text-white/30">{item.prefix}</span>
      ) : null}
      <span className="text-lg font-black leading-none tracking-tight text-white tabular-nums">
        {item.value}
        {item.unit ? (
          <span className="ml-0.5 text-sm font-bold text-white/50">{item.unit}</span>
        ) : null}
      </span>
      <span className="text-[10px] font-semibold leading-tight text-white/45">{item.label}</span>
    </div>
  )
}

function SheetImpactCard({
  item,
  accentColor,
}: {
  item: ProjectImpactItem
  accentColor: string
}) {
  const Icon = ICON_MAP[item.iconKey]
  const isSensitive = item.iconKey === 'co2'

  return (
    <div className="rounded-2xl bg-white/[0.04] p-4">
      {/* Header: icône + valeur + chip */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
          <Icon className="h-[18px] w-[18px]" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          {item.prefix ? (
            <p className="mb-0.5 text-[10px] font-semibold text-white/30">{item.prefix}</p>
          ) : null}
          <p className="text-2xl font-black leading-none tracking-tight text-white tabular-nums">
            {item.value}
            {item.unit ? (
              <span className="ml-1 text-lg font-bold text-white/50">{item.unit}</span>
            ) : null}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-white/65">{item.label}</p>
        </div>
        <span
          className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold leading-none ${
            isSensitive
              ? 'bg-amber-500/10 text-amber-400/65'
              : 'bg-white/[0.06] text-white/35'
          }`}
        >
          {isSensitive ? 'Estimation sensible' : 'Estimation'}
        </span>
      </div>

      {/* Ce que ça représente */}
      <p className="mt-3 text-[13px] leading-relaxed text-white/60">{item.meaning}</p>

      {/* Méthode + Limite — compact key-value */}
      <div className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-[10px] font-black uppercase tracking-[0.08em] text-white/25">
            Méthode
          </span>
          <span className="text-[11px] leading-relaxed text-white/50">{item.estimate}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-[10px] font-black uppercase tracking-[0.08em] text-white/25">
            Limite
          </span>
          <span className="text-[11px] leading-relaxed text-white/50">{item.caution}</span>
        </div>
      </div>
    </div>
  )
}

export function ProjectImpactPreview({ items, accentColor }: ProjectImpactPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const mainItems = items.filter((item) => item.main)
  if (mainItems.length === 0) return null

  return (
    <section>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Ce que ce projet permet
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {mainItems.map((item) => (
          <MiniCard key={item.id} item={item} accentColor={accentColor} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-white/70">Voir tous les indicateurs</span>
          <span className="text-xs text-white/35">
            {items.length} estimation{items.length > 1 ? 's' : ''} expliquée
            {items.length > 1 ? 's' : ''} avec méthode et prudence
          </span>
        </div>
        <ChevronUp className="h-4 w-4 shrink-0 text-white/25" />
      </button>

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Indicateurs du projet"
      >
        <p className="mb-5 mt-1 text-[13px] leading-relaxed text-white/45">
          Ces chiffres donnent des ordres de grandeur basés sur des hypothèses documentées.
        </p>

        <div className="space-y-3">
          {items.map((item) => (
            <SheetImpactCard key={item.id} item={item} accentColor={accentColor} />
          ))}
        </div>

        <p className="mt-5 pb-2 text-[11px] leading-relaxed text-white/25">
          Ces estimations ne constituent pas une mesure certifiée ni une promesse de résultat. La
          biodiversité reste variable et dépend du terrain.
        </p>
      </MobileSheet>
    </section>
  )
}
