'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { CurrencyAmount } from '@/components/currency'
import { cn } from '@/lib/utils'
import type { Advantage, AdvantageType } from './mock-advantages'

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'product', label: 'Produits' },
  { id: 'partner_code', label: 'Offres' },
  { id: 'experience_live', label: 'Expériences' },
] as const

function typeLabel(type: AdvantageType): string | null {
  if (type === 'partner_code') return 'Code partenaire'
  if (type === 'live') return 'Live'
  if (type === 'experience') return 'Expérience'
  return null
}

function getHref(advantage: Advantage): string {
  if (advantage.type === 'product' && advantage.productSlug) {
    return `/products/${advantage.productSlug}`
  }
  return `/advantages/${advantage.id}`
}

type Props = {
  advantages: Advantage[]
  initialType: string
}

export function AdvantagesCatalogClient({ advantages, initialType }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const active = initialType

  function setFilter(filter: string) {
    const params = filter === 'all' ? '' : `?type=${filter}`
    router.replace(`${pathname}${params}`)
  }

  const filtered = advantages.filter((a) => {
    if (active === 'all') return true
    if (active === 'product') return a.type === 'product'
    if (active === 'partner_code') return a.type === 'partner_code'
    if (active === 'experience_live') return a.type === 'live' || a.type === 'experience'
    return true
  })

  return (
    <div className="px-4 pb-24 pt-6">
      {/* Segmented control */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-[13px] font-black transition-colors',
              active === f.id
                ? 'bg-lime-300 text-[#0B0F15]'
                : 'border border-white/10 bg-white/[0.05] text-white/60 active:bg-white/10',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center text-sm font-medium text-white/30">
          Aucun avantage disponible
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0">
          {filtered.map((advantage) => (
            <li key={advantage.id}>
              <AdvantageCard advantage={advantage} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AdvantageCard({ advantage }: { advantage: Advantage }) {
  const href = getHref(advantage)
  const label = typeLabel(advantage.type)

  return (
    <Link href={href} className="group flex flex-col gap-2 transition-transform active:scale-[0.98]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-800">
        <img
          src={advantage.imageUrl}
          alt={advantage.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {advantage.status === 'soon' && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
              Bientôt
            </span>
          </div>
        )}
        {advantage.status === 'sold_out' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
              Épuisé
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        {label ? (
          <span className="text-xs uppercase tracking-wider text-lime-300/70">
            {label} · {advantage.partner}
          </span>
        ) : (
          <span className="text-xs uppercase tracking-wider text-zinc-400">{advantage.partner}</span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-white">{advantage.title}</h3>
        <div className="mt-1">
          <CurrencyAmount
            kind="impactCredits"
            value={advantage.priceCredits}
            className="text-sm font-bold"
          />
        </div>
      </div>
    </Link>
  )
}
