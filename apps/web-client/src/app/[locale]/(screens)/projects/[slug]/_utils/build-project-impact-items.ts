import { formatCompact, formatDecimal } from '@/lib/formatters'
import { getProjectImpactMetrics, type ProjectImpactMetricsInput } from './project-impact-metrics'

export type ImpactIconKey =
  | 'hives'
  | 'bees'
  | 'honey'
  | 'flowers'
  | 'co2'
  | 'tree'
  | 'oil'
  | 'coral'
  | 'area'
  | 'fish'
  | 'survival'

export type ProjectImpactItem = {
  id: string
  label: string
  value: string
  unit?: string
  prefix?: string
  group: string
  iconKey: ImpactIconKey
  main: boolean
  meaning: string
  estimate: string
  caution: string
}

export function buildProjectImpactItems(input: ProjectImpactMetricsInput): ProjectImpactItem[] {
  const metrics = getProjectImpactMetrics(input)

  if (metrics.kind === 'bees') {
    const items: ProjectImpactItem[] = []

    items.push({
      id: 'hives',
      label: 'Ruches accompagnées',
      value: String(metrics.hivesSupported),
      group: 'Soutien terrain',
      iconKey: 'hives',
      main: true,
      meaning: 'Du suivi terrain et du matériel pour accompagner les ruches dans la durée.',
      estimate: 'Estimation basée sur le coût de suivi terrain par ruche accompagnée.',
      caution: 'Le nombre réel dépend du terrain, de la saison et des pratiques apicoles.',
    })

    if (metrics.bees > 0) {
      items.push({
        id: 'bees',
        label: 'Abeilles liées aux ruches',
        value: formatCompact(metrics.bees),
        prefix: 'Environ',
        group: 'Biodiversité',
        iconKey: 'bees',
        main: true,
        meaning: 'Estimation des abeilles rattachées aux ruches accompagnées par le projet.',
        estimate: "Estimation basée sur les abeilles rattachées aux ruches accompagnées par le projet.",
        caution:
          "Ce chiffre donne un ordre de grandeur. Il ne signifie pas que chaque abeille est individuellement suivie.",
      })
    }

    if (metrics.honeyKg > 0) {
      items.push({
        id: 'honey',
        label: 'Miel potentiel',
        value: String(Math.round(metrics.honeyKg)),
        unit: 'kg',
        prefix: "Jusqu'à",
        group: 'Production',
        iconKey: 'honey',
        main: true,
        meaning: 'Une production locale mieux collectée, préparée et valorisée avec le partenaire.',
        estimate: 'Estimation basée sur le potentiel de production moyen par euro engagé.',
        caution:
          "Ce n'est pas une promesse de récolte. La production dépend des conditions climatiques et sanitaires.",
      })
    }

    if (metrics.flowers > 0) {
      items.push({
        id: 'flowers',
        label: 'Fleurs pollinisées',
        value: formatCompact(metrics.flowers),
        prefix: 'Plus de',
        group: 'Pollinisation',
        iconKey: 'flowers',
        main: false,
        meaning: 'Des abeilles actives autour des ruchers, utiles aux cultures et à la biodiversité locale.',
        estimate: "Estimation basée sur l'activité moyenne de pollinisation associée aux ruches.",
        caution:
          "Ce chiffre donne un ordre de grandeur à l'échelle du projet, pas une mesure individualisée.",
      })
    }

    if (metrics.co2Kg > 0) {
      items.push({
        id: 'co2',
        label: 'CO₂ associé (est.)',
        value: formatDecimal(metrics.co2Kg),
        unit: 'kg',
        prefix: 'Environ',
        group: 'Environnement',
        iconKey: 'co2',
        main: false,
        meaning: 'CO₂ potentiellement associé à la pollinisation des cultures liées au rucher.',
        estimate: "Estimation basée sur le ratio environnemental associé aux ruches accompagnées par le projet.",
        caution:
          "Ce n'est pas une compensation carbone. La biodiversité reste variable et dépend du terrain.",
      })
    }

    return items
  }

  if (metrics.kind === 'reef') {
    const items: ProjectImpactItem[] = []

    if (metrics.corals > 0) {
      items.push({
        id: 'coral',
        label: 'Coraux transplantés',
        value: formatCompact(metrics.corals),
        prefix: 'Environ',
        group: 'Restauration',
        iconKey: 'coral',
        main: true,
        meaning: "Nombre de fragments de corail physiquement transplantés dans le cadre de l'opération de restauration.",
        estimate: "Calculé selon les options de don ou au ratio d'un fragment pour 30 €.",
        caution:
          "Ce n'est pas une promesse de survie. La survie à 12 mois est estimée entre 60 et 85 %.",
      })
    }

    if (metrics.areaM2 !== null && metrics.areaM2 > 0) {
      items.push({
        id: 'area',
        label: 'Surface récifale',
        value: formatDecimal(metrics.areaM2),
        unit: 'm²',
        prefix: 'Environ',
        group: 'Restauration',
        iconKey: 'area',
        main: true,
        meaning: 'Surface récifale estimée couverte par les fragments implantés.',
        estimate: 'Calculé à 0,02 m² par fragment, selon les pratiques terrain.',
        caution: 'La surface réelle peut varier selon la localisation et les conditions marines.',
      })
    }

    if (metrics.survivalRate) {
      items.push({
        id: 'survival',
        label: 'Survie à 12 mois',
        value: metrics.survivalRate,
        prefix: 'Estimé',
        group: 'Suivi',
        iconKey: 'survival',
        main: true,
        meaning: "Taux de survie des fragments observé sur les projets de restauration similaires.",
        estimate: "Basé sur les données terrain de l'opérateur.",
        caution:
          "Ce taux peut varier selon les conditions océaniques. Il ne constitue pas une garantie.",
      })
    }

    if (metrics.fishShelter > 0) {
      items.push({
        id: 'fish',
        label: 'Refuges marins',
        value: formatCompact(metrics.fishShelter),
        prefix: 'Environ',
        group: 'Biodiversité marine',
        iconKey: 'fish',
        main: false,
        meaning: 'Nombre de refuges potentiels créés pour la faune marine locale.',
        estimate: "Estimé selon le nombre de fragments et la capacité habituelle d'hébergement.",
        caution:
          'La biodiversité marine est variable. Ce chiffre est une estimation pédagogique.',
      })
    }

    return items
  }

  // orchard / olive_tree
  const items: ProjectImpactItem[] = []

  if (metrics.olivesSupported > 0) {
    items.push({
      id: 'tree',
      label: 'Oliviers soutenus',
      value: formatCompact(metrics.olivesSupported),
      group: 'Soutien terrain',
      iconKey: 'tree',
      main: true,
      meaning: "Nombre d'oliviers dont l'entretien ou le suivi est soutenu par ce projet.",
      estimate: "Calculé selon la contribution rapportée au coût de suivi par arbre.",
      caution:
        "Ce n'est pas un achat d'oliviers. Le soutien couvre l'entretien et la valorisation.",
    })
  }

  if (metrics.oilGeneratedLiters > 0) {
    items.push({
      id: 'oil',
      label: 'Huile estimée',
      value: String(Math.round(metrics.oilGeneratedLiters)),
      unit: 'L',
      prefix: "Jusqu'à",
      group: 'Production',
      iconKey: 'oil',
      main: true,
      meaning: "Volume d'huile estimé que ces oliviers peuvent produire sur une récolte type.",
      estimate: "Calculé à 4 L d'huile par olivier soutenu, en moyenne de production.",
      caution:
        "Ce n'est pas une promesse de rendement. La production dépend des conditions climatiques.",
    })
  }

  if (metrics.co2SequesteredKg > 0) {
    items.push({
      id: 'co2',
      label: 'CO₂ séquestré (est.)',
      value: formatDecimal(metrics.co2SequesteredKg),
      unit: 'kg',
      prefix: 'Environ',
      group: 'Environnement',
      iconKey: 'co2',
      main: false,
      meaning: 'CO₂ potentiellement séquestré par ces oliviers sur leur cycle de croissance.',
      estimate: 'Calculé à 10 kg de CO₂ par olivier soutenu.',
      caution:
        "Ce n'est pas une compensation carbone certifiée. La biodiversité reste variable et dépend du terrain.",
    })
  }

  return items
}
