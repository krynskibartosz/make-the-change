import { Bug, Cloud, Hexagon, Lock, Waves, Flower2, Droplets, TreePine, Fish } from 'lucide-react'
import type { DonationOption, ProjectImpact } from '@/types/context'

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
  isDonationProject = false,
  donationOptions = null,
  projectType = 'beehive',
  projectImpact = null,
}: ProjectImpactCalculatorProps) {
  const displayAmount = Number.isFinite(amount) ? Math.max(amount, 0) : baseAmount

  // Calculer les métriques selon le type de projet et les ratios par €
  const bees = Math.round((projectImpact?.beesPerEur || 152) * displayAmount)
  const honeyGrams = (projectImpact?.honeyGramsPerEur || 7.7) * displayAmount
  const honeyKg = honeyGrams / 1000
  const co2Grams = (projectImpact?.beesPerEur ? 38.5 : 0) * displayAmount
  const co2Kg = co2Grams / 1000
  const honeyParts = splitDecimalValue(honeyKg)
  const co2Parts = splitDecimalValue(co2Kg)

  // Nouvelles métriques pour les abeilles
  const flowers = Math.round((projectImpact?.flowersPerEur || 1154) * displayAmount)
  const propolisGrams = (projectImpact?.propolisGramsPerEur || 0.0385) * displayAmount
  const waxGrams = (projectImpact?.waxGramsPerEur || 0.92) * displayAmount
  const pollenGrams = (projectImpact?.pollenGramsPerEur || 7.7) * displayAmount
  const nectarGrams = (projectImpact?.nectarGramsPerEur || 19.2) * displayAmount

  // Métriques pour les coraux
  const corals = Math.round(displayAmount / 18) // Basé sur les donation options
  const areaRestored = (projectImpact?.blueCarbonPotential || 0.5) * corals
  const habitatCreated = Math.round((projectImpact?.biodiversityPoints || 5) * corals)
  const fishShelter = Math.round((projectImpact?.fishShelterCapacity || 3) * corals)
  const areaParts = splitDecimalValue(areaRestored)

  // Métriques pour les oliviers
  const olivesSupported = Math.round((projectImpact?.olivesSupported || 1) * (displayAmount / 150))
  const oilGeneratedLiters = (projectImpact?.oilGeneratedLiters || 4) * olivesSupported
  const co2SequesteredKg = (projectImpact?.co2SequesteredPerOlive || 10) * olivesSupported
  const co2SequesteredParts = splitDecimalValue(co2SequesteredKg)

  const isCheckoutMode = mode === 'checkout'

  return (
    <section className="w-full">
      {!isCheckoutMode ? (
        <>
          <h3 className="text-xl font-bold text-white">
            {isDonationProject ? 'Impact collectif déjà généré' : 'Impact collectif déjà généré'}
          </h3>
          <p className="mb-4 mt-1 text-sm text-white/60">
            {`Basé sur ${formatInteger(displayAmount)} € ${isDonationProject ? 'donnés' : 'investis'}`}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {projectType === 'reef' || isDonationProject ? (
              <>
                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Waves className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(corals)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Coraux restaurés
                  </div>
                </article>

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Hexagon className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {areaParts.whole}
                    <span className="text-lg font-bold text-white/50">
                      {areaParts.fraction ? `,${areaParts.fraction}` : ''}
                      {' '}m²
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Surface restaurée
                  </div>
                </article>

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Fish className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(fishShelter)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Refuges poissons
                  </div>
                </article>

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Cloud className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(habitatCreated)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Points biodiversité
                  </div>
                </article>
              </>
            ) : projectType === 'orchard' ? (
              <>
                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <TreePine className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(olivesSupported)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Oliviers soutenus
                  </div>
                </article>

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Droplets className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(oilGeneratedLiters)}
                    <span className="text-lg font-bold text-white/50">{' '}L</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Huile générée
                  </div>
                </article>

                <article className="col-span-2 w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Cloud className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {co2SequesteredParts.whole}
                    <span className="text-lg font-bold text-white/50">
                      {co2SequesteredParts.fraction ? `,${co2SequesteredParts.fraction}` : ''}
                      {' '}kg
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    CO₂ séquestré
                  </div>
                </article>
              </>
            ) : (
              <>
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

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
                  <div className="inline-flex mb-3 rounded-full bg-white/5 p-2">
                    <Flower2 className="h-5 w-5 text-lime-400" />
                  </div>
                  <div className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight transition-all duration-300 ease-out">
                    {formatInteger(flowers)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white/65 uppercase tracking-[0.08em]">
                    Fleurs butinées
                  </div>
                </article>

                <article className="w-full rounded-2xl bg-white/4 p-5 sm:p-6">
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
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex w-full items-start justify-between border-y border-white/5 py-6 my-4">
          {projectType === 'reef' || isDonationProject ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <Waves className="mb-1 h-6 w-6 text-lime-400 drop-shadow-sm" />
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {formatInteger(corals)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Coraux
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <Hexagon className="mb-1 h-6 w-6 text-amber-500 drop-shadow-sm" />
                <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black text-white tabular-nums tracking-tighter">
                  <span>{areaParts.whole}</span>
                  <span className="text-sm font-bold text-white/50">
                    {areaParts.fraction ? `,${areaParts.fraction}` : ''}
                    {' '}m²
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Surface
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <Fish className="mb-1 h-6 w-6 text-sky-400 drop-shadow-sm" />
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {formatInteger(fishShelter)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Refuges
                </div>
              </div>
            </>
          ) : projectType === 'orchard' ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <TreePine className="mb-1 h-6 w-6 text-lime-400 drop-shadow-sm" />
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {formatInteger(olivesSupported)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Oliviers
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <Droplets className="mb-1 h-6 w-6 text-amber-500 drop-shadow-sm" />
                <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black text-white tabular-nums tracking-tighter">
                  <span>{formatInteger(oilGeneratedLiters)}</span>
                  <span className="text-sm font-bold text-white/50">{' '}L</span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Huile
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <Cloud className="mb-1 h-6 w-6 text-sky-400 drop-shadow-sm" />
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {formatInteger(co2SequesteredKg)}
                  <span className="text-sm font-bold text-white/50">{' '}kg</span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  CO₂
                </div>
              </div>
            </>
          ) : (
            <>
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
                <Flower2 className="mb-1 h-6 w-6 text-sky-400 drop-shadow-sm" />
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {formatInteger(flowers)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Fleurs
                </div>
              </div>
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
