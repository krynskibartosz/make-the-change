import { Card, CardContent } from '@make-the-change/core/ui'
import type { ProjectSpecies } from '@/types/context'

interface ProjectSpeciesImpactSectionProps {
  projectType?: string | null
  species?: ProjectSpecies[] | null
  unitPriceEur?: number | null
  unitLabel?: string | null
}

type ImpactMetric = {
  label: string
  unit: string
  fullCycleValue: number
  decimals: number
  comment?: string
}

const REFERENCE_AMOUNT_EUR = 100
const BEEHIVE_REFERENCE_VALUE_EUR = 1300
const BEEHIVE_REFERENCE_POPULATION = 50000
const BEE_KEYWORDS = ['beehive', 'miel', 'honey', 'abeille', 'bee', 'apis']

const BEEHIVE_IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Miel',
    unit: 'kg',
    fullCycleValue: 10,
    decimals: 2,
    comment: 'Base de calcul: ruche de 50 000 abeilles valorisée à 1 300 €.',
  },
  { label: 'Propolis', unit: 'g', fullCycleValue: 50, decimals: 2 },
  { label: 'Cire', unit: 'g', fullCycleValue: 1196, decimals: 0 },
  { label: 'Pollen', unit: 'kg', fullCycleValue: 10, decimals: 2 },
  { label: 'Nectar', unit: 'kg', fullCycleValue: 24.96, decimals: 2 },
  { label: 'CO2 capturé', unit: 'kg', fullCycleValue: 50, decimals: 2 },
  { label: 'Fleurs sauvages butinées', unit: 'fleurs', fullCycleValue: 1500000, decimals: 0 },
]

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const hasBeeSignal = (value: string | null | undefined) => {
  if (!value) return false
  const normalized = normalizeForMatch(value)
  return BEE_KEYWORDS.some((keyword) => normalized.includes(keyword))
}

const getHoneySpeciesContext = (
  projectType: string | null | undefined,
  species: ProjectSpecies[] | null | undefined,
) => {
  if (hasBeeSignal(projectType)) {
    const beeSpecies = species?.find((entry) => hasBeeSignal(entry.name))
    return beeSpecies?.name || 'Abeille'
  }

  const beeSpecies = species?.find(
    (entry) => hasBeeSignal(entry.name) || hasBeeSignal(entry.scientificName),
  )
  return beeSpecies?.name || null
}

const formatImpactValue = (value: number, decimals: number) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals === 0 ? 0 : Math.min(2, decimals),
    maximumFractionDigits: decimals,
  }).format(value)

export function ProjectSpeciesImpactSection({
  projectType,
  species,
  unitPriceEur,
  unitLabel,
}: ProjectSpeciesImpactSectionProps) {
  const speciesLabel = getHoneySpeciesContext(projectType || null, species || null)
  if (!speciesLabel) return null

  const ratio = REFERENCE_AMOUNT_EUR / BEEHIVE_REFERENCE_VALUE_EUR
  const beesSupported = BEEHIVE_REFERENCE_POPULATION * ratio
  const pollinatedSurfaceMin = 1 * ratio
  const pollinatedSurfaceMax = 3 * ratio

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Impact estimé ({speciesLabel})</h2>
      </div>

      <Card className="rounded-2xl border-border/50 bg-background/50">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Items associés pour {REFERENCE_AMOUNT_EUR} €
            </p>
            <p className="text-sm text-muted-foreground">
              Calcul proportionnel annuel basé sur une ruche de {BEEHIVE_REFERENCE_POPULATION.toLocaleString(
                'fr-FR',
              )}{' '}
              abeilles valorisée à {BEEHIVE_REFERENCE_VALUE_EUR.toLocaleString('fr-FR')} €.
            </p>
            {unitPriceEur ? (
              <p className="text-sm text-muted-foreground">
                Prix projet actuel: {unitPriceEur.toLocaleString('fr-FR')} €{unitLabel ? `/${unitLabel}` : ''}.
              </p>
            ) : null}
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full min-w-[660px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item impact</th>
                  <th className="px-4 py-3 font-semibold">Valeur pour 100 €</th>
                  <th className="px-4 py-3 font-semibold">Commentaires</th>
                </tr>
              </thead>
              <tbody>
                {BEEHIVE_IMPACT_METRICS.map((metric) => {
                  const computedValue = metric.fullCycleValue * ratio
                  return (
                    <tr key={metric.label} className="border-t border-border/50">
                      <td className="px-4 py-3 font-medium">{metric.label}</td>
                      <td className="px-4 py-3">
                        {formatImpactValue(computedValue, metric.decimals)} {metric.unit}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{metric.comment || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Activité & pollinisation
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                10 à 15 vols/jour, 1 à 2 km de distance, 50 à 100 fleurs/vol.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Surface pollinisée estimée pour 100 €: {formatImpactValue(pollinatedSurfaceMin, 2)} à{' '}
                {formatImpactValue(pollinatedSurfaceMax, 2)} ha.
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cycle de vie
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Abeille foragère: environ 6 semaines. Abeille d&apos;hiver: plusieurs mois.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Soutien estimé pour 100 €: {formatImpactValue(beesSupported, 0)} abeilles.
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Impact économique & écologique
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                L&apos;apiculture naturelle privilégie l&apos;équilibre de l&apos;écosystème et la résilience locale.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                La pollinisation soutient la biodiversité et la capture indirecte de CO2.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
