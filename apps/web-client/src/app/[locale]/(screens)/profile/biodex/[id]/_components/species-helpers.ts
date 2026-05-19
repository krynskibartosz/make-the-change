import type { SpeciesContext } from '@/types/species'

export function getSpeciesHeroImage(_species: SpeciesContext): string {
  return '/images/biodex/hero-apis-mellifera-unicolor.png'
}

export function getSpeciesEcologicalRole(species: SpeciesContext): string {
  const name = species.name_default.toLowerCase()
  const sci = (species.scientific_name ?? '').toLowerCase()

  if (name.includes('abeille') || sci.includes('apis mellifera')) return 'Pollinisatrice clé'

  if (species.diet) {
    const d = species.diet.toLowerCase()
    if (d.includes('nectarivore') || d.includes('pollinivore')) return 'Pollinisatrice'
    if (d.includes('herbivore')) return 'Herbivore'
    if (d.includes('carnivore')) return 'Carnivore'
    if (d.includes('insectivore')) return 'Insectivore'
    if (d.includes('omnivore')) return 'Omnivore'
  }

  return 'Espèce documentée'
}

export function getSpeciesEducationalSummary(species: SpeciesContext): string {
  const name = species.name_default.toLowerCase()
  const sci = (species.scientific_name ?? '').toLowerCase()

  if (name.includes('abeille noire') || sci.includes('apis mellifera unicolor')) {
    return "En visitant les fleurs, l'Abeille Noire transporte du pollen. Elle aide à comprendre le lien entre fleurs, ruchers et savoir-faire apicoles locaux."
  }

  if (species.description_default) return species.description_default

  return 'Cette espèce joue un rôle dans son milieu naturel.'
}
