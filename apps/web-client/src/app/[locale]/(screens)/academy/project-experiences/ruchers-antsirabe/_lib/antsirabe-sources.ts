export type ExperienceSource = {
  id: string
  claim: string
  label: string
  url?: string
}

export const ANTSIRABE_SOURCES: ExperienceSource[] = [
  {
    id: 'waggle-dance',
    claim: 'La danse frétillante encode direction (angle/soleil) et distance (durée ≈ 1 s = 1 km)',
    label: 'Riley et al., Nature (2005) — "The flight paths of honeybees recruited by the waggle dance"',
    url: 'https://www.nature.com/articles/nature03526',
  },
  {
    id: 'cacao-midges',
    claim: 'Le cacao est pollinisé principalement par des moucherons (Forcipomyia), pas par les abeilles',
    label: 'National Park Service — "Chocolate and the Midge"',
    url: 'https://www.nps.gov/articles/chocolate-midge.htm',
  },
  {
    id: 'coffee-bees',
    claim: 'Les abeilles augmentent les rendements du café de 20 à 50 % — sans être indispensables (autopollinisation possible)',
    label: 'Klein et al., Proceedings of the Royal Society B (2003)',
  },
  {
    id: 'worker-lifespan',
    claim: "Une ouvrière vit ≈ 6 semaines en été et s'use physiquement (ailes) à force de voler",
    label: 'Winston, "The Biology of the Honey Bee" (1987), Harvard University Press',
  },
  {
    id: 'foraging-radius',
    claim: 'Le rayon de butinage moyen est de 2–3 km, avec des sorties pouvant atteindre 5 km',
    label: 'Beekman & Ratnieks, Behavioral Ecology (2000)',
  },
  {
    id: 'apis-unicolor',
    claim: "Apis mellifera unicolor est endémique à Madagascar, adaptée à ses flores locales",
    label: 'Franck et al., Molecular Ecology (2001)',
  },
]
