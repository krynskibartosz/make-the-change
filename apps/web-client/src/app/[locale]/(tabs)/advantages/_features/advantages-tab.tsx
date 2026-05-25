import { ArrowRight, CalendarDays, ChevronRight, ShoppingBag, TicketPercent } from 'lucide-react'
import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import type { AdvantagesData } from './advantages-data'
import { ImpactCreditsFloatingBadge } from './impact-credits-floating-badge'

type AdvantagesTabProps = {
  impactCredits: number
  isConnected: boolean
  data: AdvantagesData
}

export function AdvantagesTab({ impactCredits, isConnected, data }: AdvantagesTabProps) {
  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-9 px-4">
        <header className="px-1 pt-2">
          <h1 className="text-[26px] font-black tracking-tight text-white">
            Avantages partenaires
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">
            Utilise tes Crédits Impact pour débloquer des réductions ou futures expériences
            partenaires. Les produits physiques s’achètent séparément en euros.
          </p>
        </header>

        {isConnected && <ImpactCreditsFloatingBadge impactCredits={impactCredits} />}

        <section>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <h2 className="text-xl font-black tracking-tight text-white">Disponibles</h2>
            <Link
              href="/advantages/catalog"
              className="flex items-center gap-1 text-sm font-black text-lime-300"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
            {data.availableAdvantages.map((advantage) => (
              <li key={advantage.id}>
                <AdvantageCard advantage={advantage} />
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/products"
          className="flex items-center gap-4 border-y border-white/[0.07] py-5 transition-opacity active:opacity-70"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lime-300">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-white">Boutique partenaire</span>
            <span className="mt-1 block text-[13px] font-medium leading-snug text-white/50">
              Coffrets et produits vendus en euros par les partenaires.
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-white/30" aria-hidden="true" />
        </Link>

        <section>
          <h2 className="mb-2 px-1 text-xl font-black tracking-tight text-white">Explorer</h2>
          <ul className="m-0 list-none divide-y divide-white/[0.07] p-0">
            {data.categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="flex items-center gap-4 py-4 active:opacity-60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-lime-300">
                    {category.id === 'discount' ? (
                      <TicketPercent className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <CalendarDays className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-white">
                      {category.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] font-medium text-white/45">
                      {category.description}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="pb-2 text-center text-[11px] font-medium leading-relaxed text-white/25">
          Les Crédits Impact sont des points internes, non échangeables et sans valeur financière.
        </p>
      </div>
    </section>
  )
}

function AdvantageCard({ advantage }: { advantage: Advantage }) {
  return (
    <Link
      href={`/advantages/${advantage.id}`}
      className="group flex flex-col gap-2 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-800">
        <img
          src={advantage.imageUrl}
          alt={advantage.title}
          className="h-full w-full object-cover"
        />
        {advantage.imageBadge && (
          <span className="absolute left-2 top-2 rounded-full bg-lime-300 px-2.5 py-1 text-[11px] font-black text-[#0B0F15] shadow-sm">
            {advantage.imageBadge}
          </span>
        )}
        {advantage.status === 'coming_soon' && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold uppercase text-white/75">
            Bientôt
          </span>
        )}
      </div>
      <span className="text-[11px] font-bold uppercase text-lime-300/75">{advantage.partner}</span>
      <h3 className="line-clamp-2 text-sm font-semibold text-white">{advantage.title}</h3>
      <CurrencyAmount
        kind="impactCredits"
        value={advantage.priceCredits}
        className="text-sm font-bold"
      />
    </Link>
  )
}
