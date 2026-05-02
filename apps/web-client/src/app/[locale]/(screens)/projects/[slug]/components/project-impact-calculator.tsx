import { Bug, Cloud, Hexagon, Lock, Waves, Flower2, Droplets, TreePine, Fish, Info } from 'lucide-react'
import type { DonationOption, ProjectImpact } from '@/app/[locale]/(screens)/projects/_types/project'
import { cn } from '@/lib/utils'
import { formatInteger, formatCompact, formatDecimal } from '@/lib/formatters'

type ImpactMode = 'project' | 'checkout'

type ProjectImpactCalculatorProps = {
  baseAmount: number
  amount: number
  mode?: ImpactMode
  isDonationProject?: boolean
  donationOptions?: DonationOption[] | null
  projectType?: string
  projectImpact?: ProjectImpact | null
}

const REFERENCE_IMPACT = {
  bees: 3800,
  honeyKg: 0.77,
  co2Kg: 3.85,
} as const

const DONATION_REFERENCE_IMPACT = {
  corals: 18,
  areaRestored: 0.5,
  habitatCreated: 18,
} as const

const BIODEX_REWARD_IMAGE_URL = '/images/diaromas/abeille noire.png' // Image générique de fallback

const splitDecimalValue = (value: number): { whole: string; fraction: string | null } => {
  const [whole = '0', fraction] = formatDecimal(value).split(',')
  return { whole, fraction: fraction ?? null }
}

const smartRound = (val: number): number => {
  if (val >= 1000) return Math.round(val / 100) * 100
  if (val >= 100) return Math.round(val / 10) * 10
  return Math.round(val)
}

function MetricCard({ icon: Icon, prefix, valueWhole, valueFraction, unit, label, colSpan = false }: any) {
  return (
    <article className={cn("w-full rounded-2xl bg-white/4 p-5 sm:p-6", colSpan && "col-span-2")}>
      <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
        <Icon className="h-5 w-5 text-lime-400" />
      </div>
      <div className="mt-1 flex flex-col justify-end min-h-[3.5rem]">
        {prefix && (
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{prefix}</span>
        )}
        <div className="text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out flex items-baseline gap-0.5">
          <span>{valueWhole}</span>
          {(valueFraction || unit) && (
            <span className="text-lg font-bold text-white/50">
              {valueFraction ? `,${valueFraction}` : ''}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
        {label}
      </div>
    </article>
  )
}

function CheckoutMetric({ icon: Icon, prefix, valueWhole, valueFraction, unit, label, iconColorClass = "text-lime-400" }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
      <Icon className={cn("mb-1 h-6 w-6 drop-shadow-sm", iconColorClass)} />
      <div className="flex flex-col items-center justify-center min-h-[3rem]">
        {prefix && (
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest -mb-0.5">{prefix}</span>
        )}
        <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black text-white tabular-nums tracking-tighter">
          <span>{valueWhole}</span>
          {(valueFraction || unit) && (
            <span className="text-sm font-bold text-white/50">
              {valueFraction ? `,${valueFraction}` : ''}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
        {label}
      </div>
    </div>
  )
}

export function ProjectImpactCalculator({
  baseAmount,
  amount,
  mode = 'project',
  isDonationProject = false,
  donationOptions = null,
  projectType = 'beehive',
  projectImpact = null,
}: ProjectImpactCalculatorProps) {
  const displayAmount = Number.isFinite(amount) ? Math.max(amount, 0) : baseAmount

  // Calculer les métriques selon le type de projet et les ratios par €
  const bees = smartRound((projectImpact?.beesPerEur || 152) * displayAmount)
  const honeyGrams = (projectImpact?.honeyGramsPerEur || 7.7) * displayAmount
  const honeyKg = honeyGrams / 1000
  const co2Grams = (projectImpact?.beesPerEur ? 38.5 : 0) * displayAmount
  const co2Kg = co2Grams / 1000
  const honeyParts = splitDecimalValue(honeyKg)
  const co2Parts = splitDecimalValue(co2Kg)

  // Nouvelles métriques pour les abeilles
  const flowers = smartRound((projectImpact?.flowersPerEur || 1154) * displayAmount)
  const propolisGrams = (projectImpact?.propolisGramsPerEur || 0.0385) * displayAmount
  const waxGrams = (projectImpact?.waxGramsPerEur || 0.92) * displayAmount
  const pollenGrams = (projectImpact?.pollenGramsPerEur || 7.7) * displayAmount
  const nectarGrams = (projectImpact?.nectarGramsPerEur || 19.2) * displayAmount

  // Métriques pour les coraux
  const corals = Math.round(displayAmount / 18) // Basé sur les donation options
  const areaRestored = (projectImpact?.blueCarbonPotential || 0.5) * corals
  const habitatCreated = smartRound((projectImpact?.biodiversityPoints || 5) * corals)
  const fishShelter = smartRound((projectImpact?.fishShelterCapacity || 3) * corals)
  const areaParts = splitDecimalValue(areaRestored)

  // Métriques pour les oliviers
  const olivesSupported = Math.round((projectImpact?.olivesSupported || 1) * (displayAmount / 150))
  const oilGeneratedLiters = (projectImpact?.oilGeneratedLiters || 4) * olivesSupported
  const oilParts = splitDecimalValue(oilGeneratedLiters)
  const co2SequesteredKg = (projectImpact?.co2SequesteredPerOlive || 10) * olivesSupported
  const co2SequesteredParts = splitDecimalValue(co2SequesteredKg)

  const isCheckoutMode = mode === 'checkout'

  return (
    <section className="w-full">
      {!isCheckoutMode ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Impact potentiel généré
              </h3>
              <p className="mb-4 mt-1 text-sm text-white/60">
                {`Basé sur ${formatInteger(displayAmount)} € ${isDonationProject ? 'donnés' : 'investis'}`}
              </p>
            </div>
            <div 
              className="group relative flex h-8 w-8 shrink-0 cursor-help items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
              title="La nature est vivante et imprévisible. Ces chiffres sont des estimations scientifiques de votre impact potentiel, calculées selon les standards de nos partenaires terrain."
            >
              <Info className="h-4 w-4 text-white/50 group-hover:text-white/80" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {projectType === 'reef' || isDonationProject ? (
              <>
                <MetricCard icon={Waves} valueWhole={formatCompact(corals)} label="Boutures plantées" />
                <MetricCard icon={Hexagon} prefix="~ Environ" valueWhole={areaParts.whole} valueFraction={areaParts.fraction} unit="m²" label="Surface restaurée" />
                <MetricCard icon={Fish} prefix="~ Environ" valueWhole={formatCompact(fishShelter)} label="Poissons abrités" />
                <MetricCard icon={Cloud} prefix="~ Environ" valueWhole={formatCompact(habitatCreated)} label="Points biodiversité" />
              </>
            ) : projectType === 'orchard' ? (
              <>
                <MetricCard icon={TreePine} valueWhole={formatCompact(olivesSupported)} label="Oliviers soutenus" />
                <MetricCard icon={Droplets} prefix="Jusqu'à" valueWhole={oilParts.whole} valueFraction={oilParts.fraction} unit="L" label="Huile estimée" />
                <MetricCard icon={Cloud} prefix="~ Environ" valueWhole={co2SequesteredParts.whole} valueFraction={co2SequesteredParts.fraction} unit="kg" label="CO₂ séquestré (est.)" colSpan />
              </>
            ) : (
              <>
                <MetricCard icon={Bug} prefix="~ Environ" valueWhole={formatCompact(bees)} label="Abeilles parrainées" />
                <MetricCard icon={Hexagon} prefix="Jusqu'à" valueWhole={honeyParts.whole} valueFraction={honeyParts.fraction} unit="kg" label="Récolte potentielle" />
                <MetricCard icon={Flower2} prefix="> Plus de" valueWhole={formatCompact(flowers)} label="Fleurs pollinisées" />
                <MetricCard icon={Cloud} prefix="~ Environ" valueWhole={co2Parts.whole} valueFraction={co2Parts.fraction} unit="kg" label="CO₂ compensé (est.)" />
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex w-full items-start justify-between border-y border-white/5 py-6 my-4">
          {projectType === 'reef' || isDonationProject ? (
            <>
              <CheckoutMetric icon={Waves} iconColorClass="text-lime-400" valueWhole={formatCompact(corals)} label="Boutures" />
              <CheckoutMetric icon={Hexagon} iconColorClass="text-amber-500" prefix="~ Environ" valueWhole={areaParts.whole} valueFraction={areaParts.fraction} unit="m²" label="Surface" />
              <CheckoutMetric icon={Fish} iconColorClass="text-sky-400" prefix="~ Environ" valueWhole={formatCompact(fishShelter)} label="Refuges" />
            </>
          ) : projectType === 'orchard' ? (
            <>
              <CheckoutMetric icon={TreePine} iconColorClass="text-lime-400" valueWhole={formatCompact(olivesSupported)} label="Oliviers" />
              <CheckoutMetric icon={Droplets} iconColorClass="text-amber-500" prefix="Jusqu'à" valueWhole={oilParts.whole} valueFraction={oilParts.fraction} unit="L" label="Huile" />
              <CheckoutMetric icon={Cloud} iconColorClass="text-sky-400" prefix="~ Environ" valueWhole={co2SequesteredParts.whole} valueFraction={co2SequesteredParts.fraction} unit="kg" label="CO₂" />
            </>
          ) : (
            <>
              <CheckoutMetric icon={Bug} iconColorClass="text-lime-400" prefix="~ Environ" valueWhole={formatCompact(bees)} label="Abeilles" />
              <CheckoutMetric icon={Hexagon} iconColorClass="text-amber-500" prefix="Jusqu'à" valueWhole={honeyParts.whole} valueFraction={honeyParts.fraction} unit="kg" label="Miel" />
              <CheckoutMetric icon={Flower2} iconColorClass="text-sky-400" prefix="> Plus de" valueWhole={formatCompact(flowers)} label="Fleurs" />
            </>
          )}
        </div>
      )}

      <article className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-linear-to-br from-black/55 to-black/35  py-3">
        <div className="relative ml-3 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/50">
          <img
            src={BIODEX_REWARD_IMAGE_URL}
            alt={isDonationProject ? "Silhouette d'une espèce marine" : "Silhouette de l'Abeille Noire"}
            className="h-full w-full object-cover brightness-0 opacity-50"
          />
          <Lock className="absolute bottom-1 right-1 h-4 w-4 text-white/45" />
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            {isCheckoutMode ? 'ESPÈCE À DÉBLOQUER' : 'ESPÈCE PROTÉGÉE PAR CE PROJET'}
          </p>
          <p className="text-sm font-bold text-white">
            {isDonationProject ? 'Espèce marine' : "L'Abeille Noire"}
          </p>
          <p className="mt-0.5 text-xs text-white/70">
            {isCheckoutMode
              ? isDonationProject
                ? "Faites un don pour l'ajouter à votre collection."
                : "Soutenez ce projet pour l'ajouter à votre collection."
              : isDonationProject
                ? 'Faune marine protégée par ce projet.'
                : 'Faune locale protégée par ce projet.'}
          </p>
        </div>
      </article>
    </section>
  )
}
