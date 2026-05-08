'use client'

import { useState } from 'react'
import {
  Activity,
  Bug,
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
import { MobileSheet } from '../ui/mobile-sheet'

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
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
          {item.prefix}
        </span>
      ) : null}
      <span className="text-lg font-black leading-none tracking-tight text-white tabular-nums">
        {item.value}
        {item.unit ? (
          <span className="ml-0.5 text-sm font-bold text-white/50">{item.unit}</span>
        ) : null}
      </span>
      <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.07em] text-white/50">
        {item.label}
      </span>
    </div>
  )
}

function SheetItem({ item, accentColor }: { item: ProjectImpactItem; accentColor: string }) {
  const Icon = ICON_MAP[item.iconKey]
  return (
    <div className="border-b border-white/6 py-5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <div>
          {item.prefix ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
              {item.prefix}
            </p>
          ) : null}
          <p className="text-xl font-black leading-none tracking-tight text-white tabular-nums">
            {item.value}
            {item.unit ? (
              <span className="ml-0.5 text-base font-bold text-white/50">{item.unit}</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.07em] text-white/50">
            {item.label}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
            Ce que ça signifie
          </p>
          <p className="text-sm leading-relaxed text-white/65">{item.meaning}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
            Comment c&apos;est estimé
          </p>
          <p className="text-sm leading-relaxed text-white/65">{item.estimate}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
            À garder en tête
          </p>
          <p className="text-sm leading-relaxed text-white/65">{item.caution}</p>
        </div>
      </div>
    </div>
  )
}

export function ProjectImpactPreview({ items, accentColor }: ProjectImpactPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const mainItems = items.filter((item) => item.main)
  if (mainItems.length === 0) return null

  // Group all items by group for the sheet
  const groups = items.reduce<Record<string, ProjectImpactItem[]>>((acc, item) => {
    const list = acc[item.group] ?? []
    list.push(item)
    return { ...acc, [item.group]: list }
  }, {})

  return (
    <section>
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
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
        className="mt-3 flex w-full flex-col items-start gap-0.5 rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className="text-sm font-bold text-white/70">Voir tous les indicateurs</span>
        <span className="text-xs text-white/35">
          {items.length} données expliquées avec méthode et prudence
        </span>
      </button>

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Indicateurs du projet"
      >
        <p className="mb-4 text-xs leading-relaxed text-white/40">
          Ces chiffres donnent des ordres de grandeur. Ils sont basés sur des hypothèses
          documentées et ne garantissent pas un résultat mesuré.
        </p>

        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group}>
            <p className="mb-1 mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
              {group}
            </p>
            {groupItems.map((item) => (
              <SheetItem key={item.id} item={item} accentColor={accentColor} />
            ))}
          </div>
        ))}
      </MobileSheet>
    </section>
  )
}
