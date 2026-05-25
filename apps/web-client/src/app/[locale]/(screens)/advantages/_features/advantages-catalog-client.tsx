'use client'

import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import type { Advantage, AdvantageType } from './mock-advantages'

function typeLabel(type: AdvantageType): string | null {
  if (type === 'discount') return 'Réduction'
  if (type === 'experience') return 'Expérience'
  return null
}

function getHref(advantage: Advantage): string {
  return `/advantages/${advantage.id}`
}

type Props = {
  advantages: Advantage[]
}

export function AdvantagesCatalogClient({ advantages }: Props) {
  return (
    <div className="px-4 pb-24 pt-6">
      <p className="mb-6 text-[14px] font-medium leading-relaxed text-white/50">
        Tous les avantages disponibles avec tes Crédits Impact.
      </p>

      <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0">
        {advantages.map((advantage) => (
          <li key={advantage.id}>
            <AdvantageCard advantage={advantage} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdvantageCard({ advantage }: { advantage: Advantage }) {
  const href = getHref(advantage)
  const label = typeLabel(advantage.type)

  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-800">
        <img
          src={advantage.imageUrl}
          alt={advantage.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {advantage.imageBadge && (
          <span className="absolute left-2 top-2 rounded-full bg-lime-300 px-2.5 py-1 text-[11px] font-black text-[#0B0F15] shadow-sm">
            {advantage.imageBadge}
          </span>
        )}
        {advantage.status === 'coming_soon' && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
              Bientôt
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
          <span className="text-xs uppercase tracking-wider text-zinc-400">
            {advantage.partner}
          </span>
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
