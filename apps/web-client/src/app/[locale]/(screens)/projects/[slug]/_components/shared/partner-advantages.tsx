import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'

type Props = {
  advantages: Advantage[]
  producerName: string
}

export function ProjectPartnerAdvantagesSection({ advantages, producerName }: Props) {
  if (advantages.length === 0) return null

  return (
    <section className="w-full max-w-full overflow-hidden">
      <h3 className="mb-1 text-xl font-bold text-white">Avantage proposé par {producerName}</h3>
      <p className="mb-4 text-xs leading-relaxed text-white/45">
        Cet avantage est proposé par le partenaire et reste distinct de ton soutien à ce projet.
      </p>
      <div className="flex flex-col gap-3">
        {advantages.map((advantage) => (
          <Link
            key={advantage.id}
            href={`/advantages/${advantage.id}`}
            className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-2 active:bg-white/[0.06]"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-white/5">
              <img
                src={advantage.imageUrl}
                alt={advantage.title}
                className="h-full w-full object-cover"
              />
              {advantage.imageBadge ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-lime-300 px-1.5 py-0.5 text-[10px] font-black text-[#0B0F15]">
                  {advantage.imageBadge}
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase text-lime-300/70">
                {advantage.type === 'discount' ? 'Réduction partenaire' : 'Expérience partenaire'}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-white">{advantage.title}</p>
              {advantage.status === 'coming_soon' ? (
                <p className="mt-1 text-xs font-semibold text-white/50">Bientôt disponible</p>
              ) : (
                <CurrencyAmount
                  kind="impactCredits"
                  value={advantage.priceCredits}
                  className="mt-1 text-sm font-bold"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
