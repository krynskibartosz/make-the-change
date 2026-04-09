import { Lock } from 'lucide-react'

type ProjectImpactCalculatorProps = {
  baseAmount: number
  amount?: number
}

const REFERENCE_IMPACT = {
  bees: 3800,
  honeyKg: 0.77,
  co2Kg: 3.85,
} as const
const BIODEX_REWARD_IMAGE_URL = '/images/diorama-chouette.png'

const formatInteger = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)

const formatDecimal = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)

export function ProjectImpactCalculator({
  baseAmount,
  amount = baseAmount,
}: ProjectImpactCalculatorProps) {
  const ratio = baseAmount > 0 ? amount / baseAmount : 0
  const bees = Math.round(REFERENCE_IMPACT.bees * ratio)
  const honeyKg = REFERENCE_IMPACT.honeyKg * ratio
  const co2Kg = REFERENCE_IMPACT.co2Kg * ratio

  return (
    <section>
      <h3 className="text-xl font-bold text-white mb-4">
        Ce que vos <span className="text-lime-400">{formatInteger(amount)} €</span> accomplissent
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl leading-none">🐝</div>
          <div className="mt-2 text-2xl font-black text-white">{formatInteger(bees)}</div>
          <div className="mt-1 text-[10px] leading-tight text-muted-foreground">
            Abeilles protégées
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl leading-none">🍯</div>
          <div className="mt-2 text-2xl font-black text-white">{formatDecimal(honeyKg)} kg</div>
          <div className="mt-1 text-[10px] leading-tight text-muted-foreground">
            Miel généré
          </div>
        </article>

        <article className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl leading-none">💨</div>
          <div className="mt-2 text-2xl font-black text-white">{formatDecimal(co2Kg)} kg</div>
          <div className="mt-1 text-[10px] leading-tight text-muted-foreground">
            CO₂ capturé
          </div>
        </article>
      </div>

      <article className="mt-3 flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 px-3 py-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/50">
          <img
            src={BIODEX_REWARD_IMAGE_URL}
            alt="Silhouette de l'Abeille Noire"
            className="h-full w-full object-cover brightness-0 opacity-50"
          />
          <Lock className="absolute bottom-1 right-1 h-4 w-4 text-white/45" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            ESPÈCE DÉBLOQUÉE
          </p>
          <p className="text-sm font-bold text-white">L&apos;Abeille Noire</p>
        </div>
      </article>
    </section>
  )
}
