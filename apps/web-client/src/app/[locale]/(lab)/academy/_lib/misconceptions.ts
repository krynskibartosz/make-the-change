import type { Misconception } from './schema'

/**
 * Catalogue partagé des idées reçues écologiques utilisées comme distracteurs.
 *
 * Chaque misconception est documentée avec :
 * - statement : le mythe tel qu'il est cru
 * - reality : la version corrigée, accessible
 * - prevalence : à quel point c'est répandu
 * - conceptIds : où ce mythe est utile dans le curriculum
 * - source : référence courte (GIEC, IPBES, ouvrage, article science)
 *
 * Ce fichier est la matière première des distracteurs de Quiz et Swipe.
 * Voir doc/writing-spec.md §5 pour les règles d'usage.
 */

export const MISCONCEPTIONS: readonly Misconception[] = [
  // ─── Énergie & matière ─────────────────────────────────────────────────────
  {
    id: 'plants-eat-soil',
    statement: 'Les plantes tirent leur masse du sol.',
    reality:
      'La masse d\'un arbre vient surtout du CO₂ de l\'air, fixé par la photosynthèse. Le sol fournit eau et minéraux (vitamines), pas le carburant.',
    prevalence: 'very-common',
    conceptIds: ['sun-energy-source', 'photosynthesis-mechanism', 'carbon-cycle-storage'],
    source: 'Mayer, R.E. (2002), "Misconceptions in science learning"',
  },
  {
    id: 'co2-is-toxic',
    statement: 'Le CO₂ est un poison.',
    reality:
      'Le CO₂ est essentiel à la photosynthèse et présent naturellement dans l\'atmosphère (~0,04 %). Le problème climatique vient de son excès, pas de sa toxicité.',
    prevalence: 'common',
    conceptIds: ['carbon-cycle-storage', 'photosynthesis-mechanism', 'climate-greenhouse-gas'],
    source: 'GIEC AR6 (2021), Chapter 1',
  },
  {
    id: 'oxygen-from-trees-only',
    statement: 'Tout l\'oxygène que nous respirons vient des forêts.',
    reality:
      'Environ 50 à 80 % de l\'oxygène atmosphérique est produit par le phytoplancton océanique (microalgues), pas par les forêts.',
    prevalence: 'very-common',
    conceptIds: ['photosynthesis-mechanism', 'ocean-phytoplankton', 'oxygen-production'],
    source: 'NOAA, "How much oxygen comes from the ocean?" (2024)',
  },
  {
    id: 'ocean-is-just-fish',
    statement: 'L\'océan, c\'est surtout des poissons.',
    reality:
      'En biomasse, le phytoplancton domine largement. Les poissons sont une fraction minuscule du vivant marin.',
    prevalence: 'common',
    conceptIds: ['ocean-phytoplankton', 'food-chain-link', 'biodiversity-marine'],
    source: 'Bar-On, Phillips & Milo (2018), PNAS, "The biomass distribution on Earth"',
  },

  // ─── Vivant & adaptation ───────────────────────────────────────────────────
  {
    id: 'evolution-is-progress',
    statement: 'Évoluer, c\'est progresser vers plus complexe ou mieux adapté.',
    reality:
      'L\'évolution n\'a pas de direction. Elle filtre seulement ce qui survit dans un environnement donné. Une bactérie est aussi "évoluée" qu\'un humain.',
    prevalence: 'very-common',
    conceptIds: ['evolution-natural-selection', 'mutation-randomness'],
    source: 'Gould, S.J. (1996), "Full House: The Spread of Excellence"',
  },
  {
    id: 'predators-are-villains',
    statement: 'Les prédateurs déstabilisent les écosystèmes.',
    reality:
      'Les grands prédateurs régulent les populations de proies et stabilisent les écosystèmes. La réintroduction du loup à Yellowstone a même restauré des rivières.',
    prevalence: 'common',
    conceptIds: ['food-chain-link', 'predator-regulation', 'trophic-cascade'],
    source: 'Ripple et al. (2014), Science, "Status and ecological effects of the world\'s largest carnivores"',
  },
  {
    id: 'species-perfectly-adapted',
    statement: 'Une espèce parfaitement adaptée à son milieu est protégée pour toujours.',
    reality:
      'L\'adaptation est relative à un environnement précis. Quand le climat ou le milieu change, l\'espèce hyper-spécialisée disparaît plus vite que les généralistes.',
    prevalence: 'common',
    conceptIds: ['evolution-natural-selection', 'extinction-causes', 'biodiversity-fragility'],
    source: 'Futuyma, D.J. (2017), "Evolution" 4th ed., chap 7',
  },
  {
    id: 'mutation-is-conscious',
    statement: 'Les espèces choisissent leurs adaptations pour survivre.',
    reality:
      'Les mutations sont aléatoires. La sélection naturelle filtre celles qui aident à survivre. Aucune espèce ne "décide" de muter.',
    prevalence: 'very-common',
    conceptIds: ['evolution-natural-selection', 'mutation-randomness'],
    source: 'Mayr, E. (2001), "What Evolution Is"',
  },
  {
    id: 'individual-evolves',
    statement: 'Un individu évolue au cours de sa vie.',
    reality:
      'Un individu ne peut pas évoluer. C\'est la population qui évolue à travers les générations. Un cou de girafe ne s\'allonge pas par effort.',
    prevalence: 'common',
    conceptIds: ['evolution-natural-selection', 'population-genetics'],
  },

  // ─── Eau & climat ──────────────────────────────────────────────────────────
  {
    id: 'concrete-helps-drainage',
    statement: 'Le béton aide l\'eau à s\'écouler dans le sol.',
    reality:
      'Le béton est imperméable : il empêche l\'infiltration et provoque ruissellement et inondations. Un sol vivant absorbe 20× plus.',
    prevalence: 'common',
    conceptIds: ['water-cycle-infiltration', 'soil-living', 'urban-impermeable'],
    source: 'INRAE (2022), "Sols urbains et imperméabilisation"',
  },
  {
    id: 'rain-comes-from-clouds-only',
    statement: 'La pluie vient uniquement des nuages formés au-dessus des océans.',
    reality:
      'Les forêts génèrent leurs propres précipitations par évapotranspiration. L\'Amazonie produit ~50 % de sa propre pluie.',
    prevalence: 'common',
    conceptIds: ['water-cycle-evaporation', 'forest-water-cycle'],
    source: 'Salati et al. (1979), "Recycling of water in the Amazon basin"',
  },
  {
    id: 'forests-just-decoration',
    statement: 'Les forêts servent surtout à embellir les paysages.',
    reality:
      'Les forêts régulent le climat local, stockent du carbone, recyclent l\'eau et abritent ~80 % de la biodiversité terrestre.',
    prevalence: 'common',
    conceptIds: ['forest-services', 'carbon-cycle-storage', 'biodiversity-terrestrial'],
    source: 'IPBES (2019), Global Assessment',
  },
  {
    id: 'local-actions-no-impact',
    statement: 'Mes actions individuelles ne changent rien à l\'échelle planétaire.',
    reality:
      'Les comportements collectifs émergent d\'actions individuelles. La réduction de viande, par exemple, a un effet mesurable au niveau agrégé.',
    prevalence: 'common',
    conceptIds: ['climate-action', 'systemic-change'],
  },
  {
    id: 'climate-natural-only',
    statement: 'Le réchauffement actuel est juste un cycle naturel.',
    reality:
      'Les cycles climatiques naturels existent, mais le rythme actuel (~1 °C en 100 ans) est 10× plus rapide. La cause humaine est attestée à >99 %.',
    prevalence: 'common',
    conceptIds: ['climate-greenhouse-gas', 'climate-action'],
    source: 'GIEC AR6 (2021), SPM',
  },

  // ─── Sols & vivant invisible ───────────────────────────────────────────────
  {
    id: 'dead-soil-is-clean',
    statement: 'Un sol stérile, sans organismes, est un bon sol.',
    reality:
      'Un sol vivant héberge bactéries, champignons, vers et insectes — c\'est cette vie qui rend le sol fertile. Un sol stérile est un sol mort.',
    prevalence: 'very-common',
    conceptIds: ['soil-living', 'microbiome-soil', 'agriculture-impact'],
    source: 'FAO (2020), "State of knowledge of soil biodiversity"',
  },
  {
    id: 'mushrooms-are-plants',
    statement: 'Les champignons sont des plantes.',
    reality:
      'Les champignons forment un règne distinct. Génétiquement, ils sont plus proches des animaux que des plantes.',
    prevalence: 'common',
    conceptIds: ['decomposers-role', 'fungi-kingdom', 'tree-of-life'],
  },
  {
    id: 'bacteria-always-bad',
    statement: 'Les bactéries sont toujours dangereuses.',
    reality:
      'La grande majorité des bactéries sont neutres ou bénéfiques. Notre intestin en contient ~40 000 milliards qui nous aident à digérer.',
    prevalence: 'very-common',
    conceptIds: ['microbiome-soil', 'symbiosis-types', 'human-microbiome'],
    source: 'Sender, Fuchs & Milo (2016), PLOS Biology',
  },
  {
    id: 'lichen-is-plant',
    statement: 'Le lichen est une plante simple.',
    reality:
      'Le lichen est une symbiose entre un champignon et une algue (parfois une cyanobactérie). Deux organismes en un.',
    prevalence: 'common',
    conceptIds: ['symbiosis-types', 'fungi-kingdom'],
  },

  // ─── Alimentation & agriculture ────────────────────────────────────────────
  {
    id: 'bio-means-no-pesticides',
    statement: 'Bio signifie zéro pesticide.',
    reality:
      'L\'agriculture bio autorise certains pesticides (cuivre, soufre, pyrèthre…) mais interdit les pesticides de synthèse. "Bio" ≠ "sans pesticide".',
    prevalence: 'very-common',
    conceptIds: ['agriculture-impact', 'pesticide-effects'],
    source: 'INRAE (2021), "Agriculture biologique : règles et impacts"',
  },
  {
    id: 'organic-always-better',
    statement: 'Un produit bio est forcément meilleur écologiquement.',
    reality:
      'Le bio réduit les pesticides mais peut demander plus de surface et d\'eau. L\'impact dépend du produit, du transport et de la saison.',
    prevalence: 'common',
    conceptIds: ['agriculture-impact', 'food-footprint'],
    source: 'Clark & Tilman (2017), Environmental Research Letters',
  },
  {
    id: 'meat-is-only-protein',
    statement: 'Pour avoir des protéines, il faut manger de la viande.',
    reality:
      'Lentilles, pois chiches, tofu, tempeh, quinoa contiennent autant de protéines au 100 g que la viande, avec une empreinte 10-50× plus faible.',
    prevalence: 'common',
    conceptIds: ['food-footprint', 'agriculture-impact'],
    source: 'Poore & Nemecek (2018), Science',
  },
  {
    id: 'local-always-better',
    statement: 'Manger local est toujours plus écologique.',
    reality:
      'Souvent vrai, mais pas toujours : une tomate cultivée sous serre chauffée hors-saison émet plus qu\'une tomate de saison importée.',
    prevalence: 'common',
    conceptIds: ['food-footprint', 'energy-cost'],
    source: 'ADEME (2022), "Empreinte carbone des aliments"',
  },

  // ─── Pollinisation & insectes ──────────────────────────────────────────────
  {
    id: 'only-bees-pollinate',
    statement: 'Seules les abeilles pollinisent.',
    reality:
      'Papillons, mouches, coléoptères, oiseaux, chauves-souris et même certains lézards pollinisent. Le vent aussi (céréales, conifères).',
    prevalence: 'common',
    conceptIds: ['pollination-agents', 'biodiversity-services'],
  },
  {
    id: 'wasps-are-useless',
    statement: 'Les guêpes ne servent à rien.',
    reality:
      'Les guêpes sont prédatrices d\'autres insectes (ravageurs des cultures), pollinisent secondairement, et participent au recyclage des matières organiques.',
    prevalence: 'common',
    conceptIds: ['biodiversity-services', 'pest-regulation'],
    source: 'Brock et al. (2021), Biological Reviews',
  },

  // ─── Forêts & biodiversité ─────────────────────────────────────────────────
  {
    id: 'planting-trees-fixes-climate',
    statement: 'Planter des arbres suffit à régler le problème climatique.',
    reality:
      'La reforestation aide mais ne compense qu\'une fraction des émissions. Préserver les forêts existantes est plus efficace que reboiser.',
    prevalence: 'very-common',
    conceptIds: ['carbon-cycle-storage', 'climate-action', 'forest-services'],
    source: 'Bastin et al. (2019) + critiques Lewis et al. (2019), Nature',
  },
  {
    id: 'old-trees-stop-absorbing',
    statement: 'Les vieux arbres ne stockent plus de carbone.',
    reality:
      'Plus un arbre vieillit, plus il stocke vite (en valeur absolue). Un vieux chêne capte plus de CO₂/an qu\'un jeune.',
    prevalence: 'common',
    conceptIds: ['carbon-cycle-storage', 'forest-age'],
    source: 'Stephenson et al. (2014), Nature',
  },

  // ─── Madagascar & endémisme ────────────────────────────────────────────────
  {
    id: 'lemurs-everywhere',
    statement: 'Les lémuriens vivent dans plusieurs régions du monde.',
    reality:
      'Tous les lémuriens (~100 espèces) vivent uniquement à Madagascar. Endémisme strict.',
    prevalence: 'common',
    conceptIds: ['endemism-isolation', 'biodiversity-madagascar'],
  },
  {
    id: 'islands-poor-biodiversity',
    statement: 'Les îles ont peu de biodiversité parce qu\'elles sont petites.',
    reality:
      'Les îles isolées concentrent souvent une biodiversité unique au monde grâce à l\'évolution en isolement (Madagascar, Galápagos, Nouvelle-Zélande).',
    prevalence: 'common',
    conceptIds: ['endemism-isolation', 'biodiversity-island'],
  },

  // ─── Récifs coralliens ─────────────────────────────────────────────────────
  {
    id: 'corals-are-plants',
    statement: 'Les coraux sont des plantes ou des roches.',
    reality:
      'Les coraux sont des animaux (cnidaires, cousins des méduses) qui hébergent des algues symbiotiques (zooxanthelles).',
    prevalence: 'very-common',
    conceptIds: ['coral-biology', 'symbiosis-types'],
    source: 'Brusca, Moore & Shuster (2016), "Invertebrates" 3rd ed.',
  },
  {
    id: 'coral-bleaching-is-death',
    statement: 'Un corail blanchi est mort.',
    reality:
      'Le blanchiment est l\'expulsion des algues symbiotiques sous stress thermique. Le corail peut survivre si le stress cesse rapidement.',
    prevalence: 'common',
    conceptIds: ['coral-biology', 'climate-ocean-warming'],
    source: 'Hughes et al. (2017), Nature',
  },

  // ─── Décomposition & cycles ────────────────────────────────────────────────
  {
    id: 'matter-disappears',
    statement: 'Quand quelque chose meurt et pourrit, la matière disparaît.',
    reality:
      'La matière ne disparaît jamais. Elle est recyclée par les décomposeurs en nutriments réutilisables. Loi de conservation de la matière.',
    prevalence: 'common',
    conceptIds: ['decomposers-role', 'matter-cycle'],
  },

  // ─── Saisons & adaptation ──────────────────────────────────────────────────
  {
    id: 'hibernation-is-sleep',
    statement: 'L\'hibernation, c\'est juste un long sommeil.',
    reality:
      'En hibernation, le métabolisme chute drastiquement (température, rythme cardiaque divisés par 10+). C\'est un état physiologique distinct.',
    prevalence: 'common',
    conceptIds: ['seasons-adaptation', 'metabolism'],
  },
  {
    id: 'leaves-fall-because-cold',
    statement: 'Les feuilles tombent parce qu\'il fait froid.',
    reality:
      'Le déclencheur principal est la baisse de luminosité (photopériode), pas la température. C\'est une stratégie d\'économie d\'eau.',
    prevalence: 'common',
    conceptIds: ['seasons-adaptation', 'plant-strategy'],
  },
] as const

// Index pour lookups rapides
const byId = new Map(MISCONCEPTIONS.map((m) => [m.id, m]))
const byConceptId = new Map<string, Misconception[]>()
for (const misconception of MISCONCEPTIONS) {
  for (const conceptId of misconception.conceptIds) {
    const existing = byConceptId.get(conceptId) ?? []
    existing.push(misconception)
    byConceptId.set(conceptId, existing)
  }
}

export function getMisconceptionById(id: string): Misconception | null {
  return byId.get(id) ?? null
}

export function getMisconceptionsByConceptId(conceptId: string): Misconception[] {
  return byConceptId.get(conceptId) ?? []
}

export function listMisconceptions(): readonly Misconception[] {
  return MISCONCEPTIONS
}
