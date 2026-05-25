import type { Advantage } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { producerTypography as typo } from './producer-typography'

type Props = {
  advantages: Advantage[]
  producerName: string
}

export function ProducerAdvantagesSection({ advantages, producerName }: Props) {
  if (advantages.length === 0) return null

  return (
    <section>
      <div className="px-4">
        <h2 className={typo.sectionTitle}>Avantages Make the Change</h2>
        <p className={`mt-1.5 ${typo.sectionSubtitle}`}>
          Utilise tes Crédits Impact pour accéder à des avantages proposés par {producerName}.
        </p>
      </div>

      <ul className="m-0 mt-4 flex list-none snap-x gap-3 overflow-x-auto px-4 pb-3 scroll-pl-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {advantages.map((advantage) => (
          <li key={advantage.id} className="w-44 shrink-0 snap-start">
            <Link href={`/advantages/${advantage.id}`} className="group flex flex-col gap-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white/5">
                <img
                  src={advantage.imageUrl}
                  alt={advantage.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {advantage.imageBadge ? (
                  <span className="absolute left-2 top-2 rounded-full bg-lime-300 px-2.5 py-1 text-[11px] font-black text-[#0B0F15]">
                    {advantage.imageBadge}
                  </span>
                ) : null}
                {advantage.status === 'coming_soon' ? (
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold uppercase text-white/75">
                    Bientôt
                  </span>
                ) : null}
              </div>
              <p className={typo.smallLabel}>
                {advantage.type === 'discount' ? 'Réduction' : 'Expérience'}
              </p>
              <h3 className={`${typo.cardTitle} line-clamp-2`}>{advantage.title}</h3>
              {advantage.status === 'available' ? (
                <CurrencyAmount
                  kind="impactCredits"
                  value={advantage.priceCredits}
                  className="text-[14px] font-extrabold"
                />
              ) : (
                <p className="text-[13px] font-semibold text-white/55">Bientôt disponible</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
