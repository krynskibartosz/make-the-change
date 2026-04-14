import { Bug, Cloud, Hexagon, Lock } from 'lucide-react'

type ImpactMode = 'project' | 'checkout'

type ProjectImpactCalculatorProps = {
  baseAmount: number
  amount: number
  mode?: ImpactMode
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

const splitDecimalValue = (value: number): { whole: string; fraction: string | null } => {
  const [whole = '0', fraction] = formatDecimal(value).split(',')
  return { whole, fraction: fraction ?? null }
}

export function ProjectImpactCalculator({
  baseAmount,
  amount,
  mode = 'project',
}: ProjectImpactCalculatorProps) {
  const displayAmount = Number.isFinite(amount) ? Math.max(amount, 0) : baseAmount
  const ratio = baseAmount > 0 ? displayAmount / baseAmount : 0
  const bees = Math.round(REFERENCE_IMPACT.bees * ratio)
  const honeyKg = REFERENCE_IMPACT.honeyKg * ratio
  const co2Kg = REFERENCE_IMPACT.co2Kg * ratio
  const honeyParts = splitDecimalValue(honeyKg)
  const co2Parts = splitDecimalValue(co2Kg)
  const isCheckoutMode = mode === 'checkout'

  return (
    <section className="w-full">
      {!isCheckoutMode ? (
        <>
          <h3 className="text-xl font-bold text-white">Impact collectif déjà généré</h3>
          <p className="mb-4 mt-1 text-sm text-white/60">
            {`Basé sur ${formatInteger(displayAmount)} € déjà investis`}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
              <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                <Bug className="h-5 w-5 text-lime-400" />
              </div>
              <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                {formatInteger(bees)}
              </div>
              <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                Abeilles protégées
              </div>
            </article>

            <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
              <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                <Hexagon className="h-5 w-5 text-lime-400" />
              </div>
              <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                {honeyParts.whole}
                <span className="text-lg font-bold text-white/50">
                  {honeyParts.fraction ? `,${honeyParts.fraction}` : ''}
                  {' '}kg
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                Miel généré
              </div>
            </article>

            <article className="col-span-2 w-full rounded-2xl bg-white/4 p-5 sm:p-6">
              <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                <Cloud className="h-5 w-5 text-lime-400" />
              </div>
              <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                {co2Parts.whole}
                <span className="text-lg font-bold text-white/50">
                  {co2Parts.fraction ? `,${co2Parts.fraction}` : ''}
                  {' '}kg
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                CO₂ capturé
              </div>
            </article>
          </div>
        </>
      ) : (
        <div className="flex w-full items-start justify-between border-y border-white/5 py-6 my-4">
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
              <Bug className="mb-1 h-6 w-6 text-lime-400 drop-shadow-sm" />
              <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                {formatInteger(bees)}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                Abeilles
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
              <Hexagon className="mb-1 h-6 w-6 text-amber-500 drop-shadow-sm" />
              <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black text-white tabular-nums tracking-tighter">
                <span>{honeyParts.whole}</span>
                <span className="text-sm font-bold text-white/50">
                  {honeyParts.fraction ? `,${honeyParts.fraction}` : ''}
                  {' '}kg
                </span>
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                Miel
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
              <Cloud className="mb-1 h-6 w-6 text-sky-400 drop-shadow-sm" />
              <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black text-white tabular-nums tracking-tighter">
                <span>{co2Parts.whole}</span>
                <span className="text-sm font-bold text-white/50">
                  {co2Parts.fraction ? `,${co2Parts.fraction}` : ''}
                  {' '}kg
                </span>
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                CO2
              </div>
            </div>
        </div>
      )}

      <article className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-linear-to-br from-black/55 to-black/35  py-3">
        <div className="relative ml-3 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/50">
          <img
            src={BIODEX_REWARD_IMAGE_URL}
            alt="Silhouette de l'Abeille Noire"
            className="h-full w-full object-cover brightness-0 opacity-50"
          />
          <Lock className="absolute bottom-1 right-1 h-4 w-4 text-white/45" />
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            {isCheckoutMode ? 'ESPÈCE À DÉBLOQUER' : 'ESPÈCE PROTÉGÉE PAR CE PROJET'}
          </p>
          <p className="text-sm font-bold text-white">L&apos;Abeille Noire</p>
          <p className="mt-0.5 text-xs text-white/70">
            {isCheckoutMode
              ? "Soutenez ce projet pour l'ajouter à votre collection."
              : 'Faune locale protégée par ce projet.'}
          </p>
        </div>
      </article>
    </section>
  )
}
