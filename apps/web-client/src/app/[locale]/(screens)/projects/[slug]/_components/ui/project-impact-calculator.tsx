import { Lock } from 'lucide-react'
import { BEEHIVE_METRICS, CORAL_METRICS, ORCHARD_METRICS } from '@/lib/project-type-icons'
import type { DonationOption, ProjectImpact } from '@/app/[locale]/(screens)/projects/_types/project'
import { cn } from '@/lib/utils'
import { formatCompact, formatDecimal, formatInteger } from '@/lib/formatters'
import { ImpactDisclaimer } from '@/app/[locale]/(screens)/projects/[slug]/_components/ui/impact-disclaimer'
import { getProjectImpactMetrics } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics'

type ImpactMode = 'project' | 'checkout'

type ProjectImpactCalculatorProps = {
  baseAmount: number
  amount: number
  mode?: ImpactMode
  isDonationProject?: boolean
  donationOptions?: DonationOption[] | null
  projectType?: string
  projectImpact?: ProjectImpact | null
  showSpeciesCard?: boolean
  accentColor?: string
}

const BIODEX_REWARD_IMAGE_URL = '/images/diaromas/abeille noire.png'

const splitDecimalValue = (value: number): { whole: string; fraction: string | null } => {
  const [whole = '0', fraction] = formatDecimal(value).split(',')
  return { whole, fraction: fraction ?? null }
}

function MetricCard({
  icon: Icon,
  prefix,
  valueWhole,
  valueFraction,
  unit,
  label,
  colSpan = false,
  iconColor = '#a3e635', // lime-400 par défaut
}: any) {
  return (
    <article className={cn('w-full rounded-2xl bg-white/4 p-5 sm:p-6', colSpan && 'col-span-2')}>
      <div className="mb-3 inline-flex rounded-full bg-white/5 p-2">
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>
      <div className="mt-1 flex min-h-[3.5rem] flex-col justify-end">
        {prefix ? (
          <span className="mb-0.5 text-xs font-bold uppercase tracking-widest text-white/40">
            {prefix}
          </span>
        ) : null}
        <div className="flex items-baseline gap-0.5 text-3xl font-black tracking-tight text-white tabular-nums transition-all duration-300 ease-out">
          <span>{valueWhole}</span>
          {(valueFraction || unit) && (
            <span className="text-lg font-bold text-white/50">
              {valueFraction ? `,${valueFraction}` : ''}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-white/65">
        {label}
      </div>
    </article>
  )
}

function CheckoutMetric({
  icon: Icon,
  prefix,
  valueWhole,
  valueFraction,
  unit,
  label,
  iconColorClass = 'text-lime-400',
}: any) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
      <Icon className={cn('mb-1 h-6 w-6 drop-shadow-sm', iconColorClass)} />
      <div className="flex min-h-[3rem] flex-col items-center justify-center">
        {prefix ? (
          <span className="-mb-0.5 text-xs font-bold uppercase tracking-widest text-white/40">
            {prefix}
          </span>
        ) : null}
        <div className="flex items-baseline justify-center gap-0.5 text-2xl font-black tracking-tighter text-white tabular-nums">
          <span>{valueWhole}</span>
          {(valueFraction || unit) && (
            <span className="text-sm font-bold text-white/50">
              {valueFraction ? `,${valueFraction}` : ''}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/40">
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
  showSpeciesCard = true,
  accentColor = '#a3e635', // lime-400 par défaut
}: ProjectImpactCalculatorProps) {
  const displayAmount = Number.isFinite(amount) ? Math.max(amount, 0) : baseAmount
  const metrics = getProjectImpactMetrics({
    amount: displayAmount,
    projectType,
    isDonationProject,
    donationOptions,
    projectImpact,
  })
  const isCheckoutMode = mode === 'checkout'

  const honeyParts = metrics.kind === 'bees' ? splitDecimalValue(metrics.honeyKg) : splitDecimalValue(0)
  const co2Parts = metrics.kind === 'bees' ? splitDecimalValue(metrics.co2Kg) : splitDecimalValue(0)
  const oilParts = metrics.kind === 'orchard' ? splitDecimalValue(metrics.oilGeneratedLiters) : splitDecimalValue(0)
  const co2SequesteredParts =
    metrics.kind === 'orchard' ? splitDecimalValue(metrics.co2SequesteredKg) : splitDecimalValue(0)
  const areaParts = metrics.kind === 'reef' && metrics.areaM2 !== null ? splitDecimalValue(metrics.areaM2) : null

  return (
    <section className="w-full">
      {!isCheckoutMode ? (
        <>
          <ImpactDisclaimer>
            <div>
              <h3 className="text-xl font-bold text-white">Ce que ce projet permet de réaliser</h3>
              <p className="mt-1 text-xs text-white/40">
                Ces chiffres donnent un ordre de grandeur de l’impact potentiel du projet. Ils sont basés sur des hypothèses documentées et ne garantissent pas un résultat mesuré.
              </p>
            </div>
          </ImpactDisclaimer>

          <div className="grid grid-cols-2 gap-4">
            {metrics.kind === 'reef' ? (
              <>
                <MetricCard
                  icon={CORAL_METRICS.corals.icon}
                  prefix="~ Environ"
                  valueWhole={formatCompact(metrics.corals)}
                  label={CORAL_METRICS.corals.label + ' associés'}
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={CORAL_METRICS.area.icon}
                  prefix="~ Environ"
                  valueWhole={areaParts?.whole ?? metrics.areaLabel}
                  valueFraction={areaParts?.fraction}
                  unit={areaParts ? 'm²' : undefined}
                  label="Surface récifale"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={CORAL_METRICS.refuges.icon}
                  prefix="~ Environ"
                  valueWhole={formatCompact(metrics.fishShelter)}
                  label="Refuges marins"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={CORAL_METRICS.survival.icon}
                  prefix="~ Estimé"
                  valueWhole={metrics.survivalRate ?? '60-85%'}
                  label="Survie à 12 mois"
                  iconColor={accentColor}
                />
              </>
            ) : metrics.kind === 'orchard' ? (
              <>
                <MetricCard icon={ORCHARD_METRICS.trees.icon} valueWhole={formatCompact(metrics.olivesSupported)} label="Oliviers soutenus" iconColor={accentColor} />
                <MetricCard
                  icon={ORCHARD_METRICS.oil.icon}
                  prefix="Jusqu'à"
                  valueWhole={oilParts.whole}
                  valueFraction={oilParts.fraction}
                  unit="L"
                  label="Huile estimée"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={ORCHARD_METRICS.co2.icon}
                  prefix="~ Environ"
                  valueWhole={co2SequesteredParts.whole}
                  valueFraction={co2SequesteredParts.fraction}
                  unit="kg"
                  label="CO₂ séquestré (est.)"
                  colSpan
                  iconColor={accentColor}
                />
              </>
            ) : (
              <>
                <MetricCard
                  icon={BEEHIVE_METRICS.bees.icon}
                  prefix="~ Environ"
                  valueWhole={formatCompact(metrics.bees)}
                  label="Abeilles associées"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={BEEHIVE_METRICS.honey.icon}
                  prefix="Jusqu'à"
                  valueWhole={honeyParts.whole}
                  valueFraction={honeyParts.fraction}
                  unit="kg"
                  label="Récolte potentielle"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={BEEHIVE_METRICS.flowers.icon}
                  prefix="> Plus de"
                  valueWhole={formatCompact(metrics.flowers)}
                  label="Fleurs visitées"
                  iconColor={accentColor}
                />
                <MetricCard
                  icon={BEEHIVE_METRICS.co2.icon}
                  prefix="~ Environ"
                  valueWhole={co2Parts.whole}
                  valueFraction={co2Parts.fraction}
                  unit="kg"
                  label="CO₂ associé (est.)"
                  iconColor={accentColor}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <div className="my-4 flex w-full items-start justify-between border-y border-white/5 py-6">
          {metrics.kind === 'reef' ? (
            <>
              <CheckoutMetric
                icon={CORAL_METRICS.corals.icon}
                iconColorClass={CORAL_METRICS.corals.color}
                prefix="~ Environ"
                valueWhole={formatCompact(metrics.corals)}
                label="Coraux"
              />
              <CheckoutMetric
                icon={CORAL_METRICS.area.icon}
                iconColorClass={CORAL_METRICS.area.color}
                prefix="~ Environ"
                valueWhole={areaParts?.whole ?? metrics.areaLabel}
                valueFraction={areaParts?.fraction}
                unit={areaParts ? 'm²' : undefined}
                label="Récif"
              />
              <CheckoutMetric
                icon={CORAL_METRICS.refuges.icon}
                iconColorClass={CORAL_METRICS.refuges.color}
                prefix="~ Environ"
                valueWhole={formatCompact(metrics.fishShelter)}
                label="Refuges"
              />
            </>
          ) : metrics.kind === 'orchard' ? (
            <>
              <CheckoutMetric icon={ORCHARD_METRICS.trees.icon} iconColorClass={ORCHARD_METRICS.trees.color} valueWhole={formatCompact(metrics.olivesSupported)} label="Oliviers" />
              <CheckoutMetric icon={ORCHARD_METRICS.oil.icon} iconColorClass={ORCHARD_METRICS.oil.color} prefix="Jusqu'à" valueWhole={oilParts.whole} valueFraction={oilParts.fraction} unit="L" label="Huile" />
              <CheckoutMetric icon={ORCHARD_METRICS.co2.icon} iconColorClass={ORCHARD_METRICS.co2.color} prefix="~ Environ" valueWhole={co2SequesteredParts.whole} valueFraction={co2SequesteredParts.fraction} unit="kg" label="CO₂" />
            </>
          ) : (
            <>
              <CheckoutMetric icon={BEEHIVE_METRICS.bees.icon} iconColorClass={BEEHIVE_METRICS.bees.color} prefix="~ Environ" valueWhole={formatCompact(metrics.bees)} label="Abeilles" />
              <CheckoutMetric icon={BEEHIVE_METRICS.honey.icon} iconColorClass={BEEHIVE_METRICS.honey.color} prefix="Jusqu'à" valueWhole={honeyParts.whole} valueFraction={honeyParts.fraction} unit="kg" label="Miel" />
              <CheckoutMetric icon={BEEHIVE_METRICS.flowers.icon} iconColorClass={BEEHIVE_METRICS.flowers.color} prefix="> Plus de" valueWhole={formatCompact(metrics.flowers)} label="Fleurs" />
            </>
          )}
        </div>
      )}

      {showSpeciesCard ? (
        <article className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-linear-to-br from-black/55 to-black/35 py-3">
          <div className="relative ml-3 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/50">
            <img
              src={BIODEX_REWARD_IMAGE_URL}
              alt={isDonationProject ? "Silhouette d'une espèce marine" : "Silhouette de l'Abeille Noire"}
              className="h-full w-full object-cover brightness-0 opacity-50"
            />
            <Lock className="absolute bottom-1 right-1 h-4 w-4 text-white/45" />
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/50">
              {isCheckoutMode ? 'ESPÈCE À DÉBLOQUER' : 'ESPÈCE ASSOCIÉE À CE PROJET'}
            </p>
            <p className="text-sm font-bold text-white">
              {isDonationProject ? 'Espèce marine' : "L'Abeille Noire"}
            </p>
            <p className="mt-0.5 text-sm text-white/70">
              {isCheckoutMode
                ? isDonationProject
                  ? "Faites un don pour l'ajouter à votre collection."
                  : "Soutenez ce projet pour l'ajouter à votre collection."
                : isDonationProject
                  ? 'Faune marine associée à ce projet.'
                  : 'Faune locale associée à ce projet.'}
            </p>
          </div>
        </article>
      ) : null}
    </section>
  )
}
