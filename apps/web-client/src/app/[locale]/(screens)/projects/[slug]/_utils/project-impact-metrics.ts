import type { DonationOption, ProjectImpact } from '@/app/[locale]/(screens)/projects/_types/project'

export type ProjectImpactMetricsInput = {
  amount: number
  projectType?: string | null
  isContributionProject?: boolean
  donationOptions?: DonationOption[] | null
  projectImpact?: ProjectImpact | null
}

type BeesImpactMetrics = {
  kind: 'bees'
  hivesSupported: number
  bees: number
  honeyKg: number
  co2Kg: number
  flowers: number
  propolisGrams: number
  waxGrams: number
  pollenGrams: number
  nectarGrams: number
}

type ReefImpactMetrics = {
  kind: 'reef'
  corals: number
  areaM2: number | null
  areaLabel: string
  fishShelter: number
  survivalRate?: string
}

type OrchardImpactMetrics = {
  kind: 'orchard'
  olivesSupported: number
  oilGeneratedLiters: number
  co2SequesteredKg: number
}

export type ProjectImpactMetrics = BeesImpactMetrics | ReefImpactMetrics | OrchardImpactMetrics

const DEFAULT_CORAL_EUR = 30

export function getProjectImpactMetrics({
  amount,
  projectType = 'beehive',
  isContributionProject = false,
  donationOptions = null,
  projectImpact = null,
}: ProjectImpactMetricsInput): ProjectImpactMetrics {
  const displayAmount = Number.isFinite(amount) ? Math.max(amount, 0) : 0
  const isReef = projectType === 'reef' || projectType === 'coral' || isContributionProject

  if (isReef) {
    const selectedOption = donationOptions?.find((option) => option.price === displayAmount) ?? null
    const corals = selectedOption?.impact.unitsRestored ?? Math.max(1, Math.round(displayAmount / DEFAULT_CORAL_EUR))
    const areaLabel = selectedOption?.impact.areaRestored ?? formatAreaLabel(corals * 0.02)
    const areaM2 = parseAreaM2(areaLabel)

    return {
      kind: 'reef',
      corals,
      areaM2,
      areaLabel,
      fishShelter: selectedOption?.impact.habitatCreated ?? corals,
      survivalRate: selectedOption?.impact.survivalRate,
    }
  }

  if (projectType === 'orchard' || projectType === 'olive_tree') {
    const olivesSupported = Math.max(
      1,
      Math.round((projectImpact?.olivesSupported || 1) * (displayAmount / 150)),
    )

    return {
      kind: 'orchard',
      olivesSupported,
      oilGeneratedLiters: (projectImpact?.oilGeneratedLiters || 4) * olivesSupported,
      co2SequesteredKg: (projectImpact?.co2SequesteredPerOlive || 10) * olivesSupported,
    }
  }

  const honeyGrams = (projectImpact?.honeyGramsPerEur || 7.7) * displayAmount
  const co2Grams = (projectImpact?.co2GramsPerEur || 38.5) * displayAmount

  return {
    kind: 'bees',
    hivesSupported: Math.max(1, Math.round((projectImpact?.hivesPerEur || 0.0008) * displayAmount)),
    bees: smartRound((projectImpact?.beesPerEur || 152) * displayAmount),
    honeyKg: honeyGrams / 1000,
    co2Kg: co2Grams / 1000,
    flowers: smartRound((projectImpact?.flowersPerEur || 1154) * displayAmount),
    propolisGrams: (projectImpact?.propolisGramsPerEur || 0.0385) * displayAmount,
    waxGrams: (projectImpact?.waxGramsPerEur || 0.92) * displayAmount,
    pollenGrams: (projectImpact?.pollenGramsPerEur || 7.7) * displayAmount,
    nectarGrams: (projectImpact?.nectarGramsPerEur || 19.2) * displayAmount,
  }
}

export function smartRound(value: number): number {
  if (value >= 1000) return Math.round(value / 100) * 100
  if (value >= 100) return Math.round(value / 10) * 10
  return Math.round(value)
}

function parseAreaM2(value: string): number | null {
  const normalized = value.replace(',', '.')
  const match = normalized.match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

function formatAreaLabel(value: number): string {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m2`
}
