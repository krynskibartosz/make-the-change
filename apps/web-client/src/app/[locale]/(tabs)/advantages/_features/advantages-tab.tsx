import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Handshake,
  Leaf,
  Package,
  PlayCircle,
  Sparkles,
  TicketPercent,
} from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import type { AdvantagesData } from './advantages-data'

type AdvantagesTabProps = {
  impactCredits: number
  data: AdvantagesData
}

export function AdvantagesTab({ impactCredits, data }: AdvantagesTabProps) {
  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-7 md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b from-white/[0.04] to-[#0B0F15]" />
      <div className="pointer-events-none absolute left-1/2 top-[-8rem] z-[-1] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-lime-400/10 blur-[110px]" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4">
        <section className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-lime-300/80">
                Tes avantages
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tighter text-white">
                Utilise tes Credits Impact
              </h1>
              <p className="mt-4 max-w-sm text-[15px] font-medium leading-relaxed text-white/62">
                Produits, offres et expériences chez les partenaires du vivant.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end rounded-3xl border border-amber-300/15 bg-amber-300/10 px-3 py-2 text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200/70">
                Solde
              </span>
              <CurrencyAmount
                kind="impactCredits"
                value={impactCredits}
                notation="compact"
                className="mt-1 text-lg font-black text-amber-200"
              />
            </div>
          </div>
          <p className="mt-5 rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-xs font-semibold leading-relaxed text-white/45">
            Les Credits Impact donnent accès à des avantages. Ils ne constituent pas une preuve d’impact automatique.
          </p>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Priorité</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Utiliser mes crédits</h2>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-black text-lime-300 active:text-lime-200">
              Voir tout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
            {data.featuredProducts.map((product) => (
              <li key={product.id}>
                <Link href={product.href} className="group block active:scale-[0.98] transition-transform">
                  <article className="overflow-hidden rounded-[1.65rem] border border-white/7 bg-white/[0.045]">
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-black/10 bg-black/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                        {product.badge}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/35">{product.partner}</p>
                      <h3 className="mt-1 line-clamp-2 text-[15px] font-black leading-tight text-white">{product.title}</h3>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <CurrencyAmount
                          kind="impactCredits"
                          value={product.priceImpactCredits}
                          className="text-sm font-black text-amber-300"
                        />
                        <span className="text-[10px] font-bold text-emerald-300/75">{product.stockLabel}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
            <li>
              <Link href={data.partnerOffer.href} className="group block h-full active:scale-[0.98] transition-transform">
                <article className="flex h-full min-h-[14rem] flex-col justify-between rounded-[1.65rem] border border-sky-300/15 bg-sky-300/10 p-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-100/80">
                      <TicketPercent className="h-3 w-3" aria-hidden="true" />
                      {data.partnerOffer.badge}
                    </span>
                    <h3 className="mt-4 text-xl font-black leading-tight tracking-tight text-white">{data.partnerOffer.title}</h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/45">{data.partnerOffer.partner}</p>
                    <p className="mt-3 text-[13px] font-medium leading-relaxed text-white/58">{data.partnerOffer.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <CurrencyAmount
                      kind="impactCredits"
                      value={data.partnerOffer.costImpactCredits}
                      className="text-sm font-black text-sky-100"
                    />
                    <ChevronRight className="h-5 w-5 text-sky-100/80" aria-hidden="true" />
                  </div>
                </article>
              </Link>
            </li>
          </ul>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-lime-300/12 bg-lime-300/[0.075] p-5">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-200">
              <PlayCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-lime-200/70">Bonus collectif</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{data.collectiveBonus.title}</h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/40">{data.collectiveBonus.partner}</p>
              <p className="mt-3 text-[14px] font-medium leading-relaxed text-white/62">{data.collectiveBonus.description}</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-black text-white/50">
              <span>Objectif collectif bientôt atteint</span>
              <span>{data.collectiveBonus.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-lime-300" style={{ width: `${data.collectiveBonus.progress}%` }} />
            </div>
          </div>
          <Link href={data.collectiveBonus.href} className="mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#0B0F15] transition-transform active:scale-[0.98]">
            {data.collectiveBonus.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section>
          <div className="mb-4 px-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Découvrir</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Explorer les avantages</h2>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {data.categories.map((category) => (
              <li key={category.id}>
                <Link href={category.href} className="flex items-center gap-4 rounded-[1.5rem] border border-white/7 bg-white/[0.045] p-4 active:bg-white/[0.07]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/7 text-lime-300">
                    {category.id === 'harvests' ? <Package className="h-5 w-5" aria-hidden="true" /> : null}
                    {category.id === 'partner-offers' ? <Handshake className="h-5 w-5" aria-hidden="true" /> : null}
                    {category.id === 'experiences' ? <CalendarDays className="h-5 w-5" aria-hidden="true" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-black text-white">{category.title}</span>
                    <span className="mt-1 block text-sm font-medium leading-snug text-white/48">{category.description}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/30" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-4 px-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Réseau</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Partenaires</h2>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0">
            {data.partners.map((partner) => (
              <li key={partner.id}>
                <Link href={partner.href} className="block rounded-[1.5rem] border border-white/7 bg-white/[0.045] p-4 active:bg-white/[0.07]">
                  <article className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/7 text-emerald-300">
                      <Leaf className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black leading-tight text-white">{partner.name}</h3>
                        <span className="shrink-0 rounded-full bg-white/7 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white/42">
                          {partner.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-white/52">{partner.description}</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-white/7 bg-white/[0.045] p-5">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/12 text-amber-200">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Comprendre</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Relier les avantages au terrain</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/55">
                Explore les espèces, les projets et les contenus éducatifs avant d’utiliser tes Credits Impact.
              </p>
              <Link href="/adventure" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-200">
                Continuer l’aventure
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
