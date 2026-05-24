import { ArrowRight, CalendarDays, ChevronRight, Handshake, Package, Sparkles } from 'lucide-react'
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
  const bonusProgress = Math.round(
    (data.collectiveBonus.currentStep / data.collectiveBonus.totalSteps) * 100,
  )

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-[max(1.75rem,env(safe-area-inset-top))] md:pb-10">

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4">

        {/* ── Intro ── */}
        <div className="px-1 pt-2">
          <h1 className="text-[26px] font-black tracking-tight text-white">
            Avantages Partenaires
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">
            Utilise tes Credits Impact pour accéder à des produits, offres et expériences liés aux partenaires du vivant.
          </p>
        </div>

        {/* Badge flottant Credits Impact */}
        {isConnected && <ImpactCreditsFloatingBadge impactCredits={impactCredits} />}

        {/* ── 1. À utiliser maintenant — tuiles ouvertes 2 col ── */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <h2 className="text-xl font-black tracking-tight text-white">À utiliser maintenant</h2>
            <Link
              href="/advantages/catalog"
              className="flex items-center gap-1 text-sm font-black text-lime-300 active:text-lime-200"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0">
            {data.featuredProducts.map((product) => (
              <li key={product.id}>
                <AdvantageCard
                  href={product.href}
                  imageUrl={product.imageUrl}
                  partner={product.partner}
                  title={product.title}
                  priceCredits={product.priceImpactCredits}
                />
              </li>
            ))}
            <li>
              <AdvantageCard
                href={data.partnerOffer.href}
                imageUrl={data.partnerOffer.imageUrl}
                partner={data.partnerOffer.partner}
                title={data.partnerOffer.title}
                priceCredits={data.partnerOffer.priceImpactCredits}
              />
            </li>
          </ul>
        </section>

        {/* ── 2. Prochain avantage collectif — tuile éditoriale ouverte ── */}
        <section>
          <h2 className="mb-4 px-1 text-xl font-black tracking-tight text-white">
            Prochain avantage collectif
          </h2>
          <Link
            href={data.collectiveBonus.href}
            className="group block transition-transform active:scale-[0.985]"
          >
            {/* Image with overlay */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem]">
              <img
                src={data.collectiveBonus.imageUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                {data.collectiveBonus.currentStep < data.collectiveBonus.totalSteps && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                    <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                    Bientôt débloqué
                  </span>
                )}
                <h3 className="mt-1 text-[18px] font-black leading-tight tracking-tight text-white">
                  {data.collectiveBonus.title}
                </h3>
                <p className="mt-1 text-[13px] font-medium leading-snug text-white/65">
                  Prochaine étape · {data.collectiveBonus.nextStepLabel}
                </p>
              </div>
            </div>

            {/* Progress bar + CTA — outside image */}
            <div className="mt-4 px-1">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold">
                <span className="text-white/48">
                  Étape {data.collectiveBonus.currentStep} sur {data.collectiveBonus.totalSteps}
                </span>
                <span className="text-lime-300/75">{bonusProgress} %</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-lime-300"
                  style={{ width: `${bonusProgress}%` }}
                />
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-black text-lime-300">
                {data.collectiveBonus.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        </section>

        {/* ── 3. Explorer les avantages — rows avec séparateurs ── */}
        <section>
          <h2 className="mb-2 px-1 text-xl font-black tracking-tight text-white">
            Explorer les avantages
          </h2>
          <ul className="m-0 list-none divide-y divide-white/[0.07] p-0">
            {data.categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="flex items-center gap-4 py-4 transition-opacity active:opacity-60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-lime-300">
                    {category.id === 'harvests' && <Package className="h-5 w-5" aria-hidden="true" />}
                    {category.id === 'partner-offers' && <Handshake className="h-5 w-5" aria-hidden="true" />}
                    {category.id === 'experiences' && <CalendarDays className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-white">{category.title}</span>
                    <span className="mt-0.5 block text-[13px] font-medium leading-snug text-white/45">
                      {category.description}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 4. Partenaires — rows avec séparateurs ── */}
        <section>
          <h2 className="mb-2 px-1 text-xl font-black tracking-tight text-white">Partenaires</h2>
          <ul className="m-0 list-none divide-y divide-white/[0.07] p-0">
            {data.partners.map((partner) => (
              <li key={partner.id}>
                <Link
                  href={partner.href}
                  className="flex gap-4 py-4 transition-opacity active:opacity-60"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/5">
                    <img src={partner.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-semibold leading-tight text-white">{partner.name}</h3>
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
                    </div>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-white/32">
                      {partner.location}
                    </p>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-white/50">
                      {partner.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 5. Comprendre — texte + lien, sans fond ── */}
        <section className="px-1">
          <h2 className="text-base font-black text-white">Comprendre ce que tu soutiens</h2>
          <p className="mt-1 text-sm font-medium leading-relaxed text-white/50">
            Les produits et expériences sont liés à des projets, des espèces et des partenaires de terrain.
          </p>
          <Link
            href="/learn"
            className="mt-3 inline-flex items-center gap-2 text-sm font-black text-lime-300 active:text-lime-200"
          >
            Explorer dans Apprendre
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        {/* ── Mention légale ── */}
        <p className="pb-2 text-center text-[11px] font-medium leading-relaxed text-white/25">
          Les Credits Impact donnent accès à des avantages. Ils ne constituent pas une preuve d'impact automatique.
        </p>

      </div>
    </section>
  )
}

function AdvantageCard({
  href,
  imageUrl,
  partner,
  title,
  priceCredits,
}: {
  href: string
  imageUrl: string
  partner: string
  title: string
  priceCredits: number
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-800">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-wider text-zinc-400">{partner}</span>
        <h3 className="line-clamp-2 text-sm font-semibold text-white">{title}</h3>
        <div className="mt-1">
          <CurrencyAmount kind="impactCredits" value={priceCredits} className="text-sm font-bold" />
        </div>
      </div>
    </Link>
  )
}
