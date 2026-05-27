import { ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react'
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
  const availableAdvantages = data.availableAdvantages.filter(
    (advantage) => advantage.status === 'available',
  )
  const upcomingAdvantages = data.availableAdvantages.filter(
    (advantage) => advantage.status === 'coming_soon',
  )

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-9 px-4">
        <header className="px-1 pt-2">
          <h1 className="text-[26px] font-black tracking-tight text-white">
            Avantages partenaires
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">
            Soutiens des projets, reçois des Crédits Impact et utilise-les pour débloquer des
            avantages partenaires.
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-lime-300"
          >
            Découvrir les projets
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        {isConnected && <ImpactCreditsFloatingBadge impactCredits={impactCredits} />}

        <section>
          <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">
            Disponible maintenant
          </h2>
          <ul className="m-0 list-none p-0">
            {availableAdvantages.map((advantage) => (
              <li key={advantage.id}>
                <AvailableAdvantageCard advantage={advantage} />
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/products"
          className="flex items-center gap-4 rounded-2xl bg-white/[0.04] px-4 py-4 transition-opacity active:opacity-70"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-lime-300">
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

        {upcomingAdvantages.length > 0 && (
          <section>
            <h2 className="mb-1 px-1 text-xl font-black tracking-tight text-white">
              Bientôt disponible
            </h2>
            <p className="mb-4 px-1 text-[13px] font-medium text-white/48">
              Des expériences partenaires seront proposées lorsque leurs dates seront confirmées.
            </p>
            <ul className="m-0 list-none p-0">
              {upcomingAdvantages.map((advantage) => (
                <li key={advantage.id}>
                  <UpcomingAdvantageCard advantage={advantage} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="pb-2 text-center text-[11px] font-medium leading-relaxed text-white/25">
          Les Crédits Impact sont internes à Make the Change, non échangeables et sans valeur financière.
        </p>
      </div>
    </section>
  )
}

function AvailableAdvantageCard({ advantage }: { advantage: Advantage }) {
  return (
    <Link
      href={`/advantages/${advantage.id}`}
      className="group block transition active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-800">
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
      </div>
      <span className="mt-5 block px-1">
        <span className="text-[11px] font-bold uppercase text-lime-300/75">
          {advantage.partner}
        </span>
        <span className="mt-1.5 block text-lg font-bold leading-snug text-white">
          {advantage.title}
        </span>
        <span className="mt-4 flex flex-wrap items-center gap-1.5 text-sm font-black text-lime-300">
          <span>Débloquer la remise</span>
          <span aria-hidden="true">·</span>
          <CurrencyAmount
            kind="impactCredits"
            value={advantage.priceCredits}
            className="text-sm font-black"
          />
        </span>
      </span>
    </Link>
  )
}

function UpcomingAdvantageCard({ advantage }: { advantage: Advantage }) {
  return (
    <Link
      href={`/advantages/${advantage.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-2.5 transition active:scale-[0.99]"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
        <img
          src={advantage.imageUrl}
          alt={advantage.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold uppercase text-white/75">
          Bientôt
        </span>
      </div>
      <span className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase text-lime-300/70">
          {advantage.partner}
        </span>
        <span className="mt-1 block text-sm font-bold leading-snug text-white">
          {advantage.title}
        </span>
        <span className="mt-1 block text-[12px] font-medium leading-snug text-white/48">
          Dates et réservation à confirmer.
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
    </Link>
  )
}
