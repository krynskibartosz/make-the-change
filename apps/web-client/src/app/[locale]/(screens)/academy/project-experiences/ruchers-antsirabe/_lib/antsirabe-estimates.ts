// Toutes les valeurs sont des ordres de grandeur — jamais des mesures précises.
// Chaque entrée indique sa source et ses marges d'incertitude.

export const ANTSIRABE_PROJECT = {
  apiculteur: 'Andraina',
  location: 'Antsirabe, Madagascar',
  hiveCount: 45,
} as const

export const HIVE_ESTIMATES = {
  beesPerHive: {
    value: 60_000,
    display: '≈ 60 000',
    note: 'Colonie saine en pleine saison (fourchette réelle : 30 000 – 80 000 selon période et ruche)',
  },
  foragingRadiusKm: {
    value: 3,
    display: '≈ 3 km',
    note: 'Rayon courant (certaines butineuses vont jusqu\'à 5 km — mais ce n\'est pas la norme)',
  },
  foragingAreaKm2: {
    value: 28,
    display: '≈ 28 km²',
    note: 'Calculé : π × 3² ≈ 28 km² par ruche (zones se chevauchent entre ruches)',
  },
  flowersPerDayPerHive: {
    value: 2_000_000,
    display: '≈ 2 millions',
    note: 'Estimation haute : ~20 000 butineuses × 100 fleurs/sortie × 10 sorties/jour',
  },
} as const

export const HONEY_ESTIMATES = {
  flowersPer500g: {
    value: 2_000_000,
    display: '≈ 2 millions de fleurs',
    note: 'Ordres de grandeur publiés — variables selon espèce florale et teneur en nectar',
  },
  collectiveFlightKmPer500g: {
    value: 80_000,
    display: '≈ 80 000 km',
    note: '≈ 2 tours de la Terre (40 075 km). Estimation collective de la ruche, pas d\'une seule abeille',
  },
  workerLifespanWeeks: {
    value: 6,
    display: '≈ 6 semaines',
    note: 'En été actif. En hiver, les ouvrières dites "d\'hiver" vivent plusieurs mois',
  },
  honeyPerWorkerLifetimeTsp: {
    display: '1/12 de cuillère à café',
    note: 'Estimation pédagogique classique — valeur exacte non mesurable individuellement',
  },
} as const
