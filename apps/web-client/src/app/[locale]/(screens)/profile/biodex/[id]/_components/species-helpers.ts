import type { SpeciesContext } from '@/types/species'

const DEFAULT_SPECIES_HERO_IMAGE = '/images/biodex/hero-apis-mellifera-unicolor.png'

const SPECIES_HERO_IMAGES_BY_SCIENTIFIC_NAME: Record<string, string> = {
  'acropora muricata': '/images/biodex/hero-acropora-muricata.png',
  'aglais io': '/images/biodex/hero-aglais-io.png',
  'amphiprion ocellaris': '/images/biodex/hero-amphiprion-ocellaris.png',
  'apis mellifera ligustica': '/images/biodex/hero-apis-mellifera-ligustica.png',
  'apis mellifera unicolor': DEFAULT_SPECIES_HERO_IMAGE,
  'athene superciliaris': '/images/biodex/hero-athene-superciliaris.png',
  'bombus terrestris': '/images/biodex/hero-bombus-terrestris.png',
  'calumma parsonii': '/images/biodex/hero-calumma-parsonii.png',
  'chaetodon auriga': '/images/biodex/hero-chaetodon-auriga.png',
  'chelonia mydas': '/images/biodex/hero-chelonia-mydas.png',
  'chrysiptera cyanea': '/images/biodex/hero-chrysiptera-cyanea.png',
  'coccinella septempunctata': '/images/biodex/hero-coccinella-septempunctata.png',
  'corythornis madagascariensis': '/images/biodex/hero-corythornis-madagascariensis.png',
  'coua caerulea': '/images/biodex/hero-coua-caerulea.png',
  'dyscophus antongilii': '/images/biodex/hero-dyscophus-antongilii.png',
  'episyrphus balteatus': '/images/biodex/hero-episyrphus-balteatus.png',
  'erinaceus europaeus': '/images/biodex/hero-erinaceus-europaeus.png',
  'furcifer pardalis': '/images/biodex/hero-furcifer-pardalis.png',
  'gonepteryx rhamni': '/images/biodex/hero-gonepteryx-rhamni.png',
  'hippocampus bargibanti': '/images/biodex/hero-hippocampus-bargibanti.png',
  'indri indri': '/images/biodex/hero-indri-indri.png',
  'liotrigona bitika': '/images/biodex/hero-liotrigona-bitika.png',
  'megachile centuncularis': '/images/biodex/hero-megachile-centuncularis.png',
  'olea europaea': '/images/biodex/hero-olea-europaea.png',
  'osmia bicornis': '/images/biodex/hero-osmia-bicornis.png',
  'phelsuma laticauda': '/images/biodex/hero-phelsuma-laticauda.png',
  'propithecus diadema': '/images/biodex/hero-propithecus-diadema.png',
  'trachelophorus giraffa': '/images/biodex/hero-trachelophorus-giraffa.png',
  'upupa epops': '/images/biodex/hero-upupa-epops.png',
  'varecia variegata': '/images/biodex/hero-varecia-variegata.png',
}

export function getSpeciesHeroImage(species: SpeciesContext): string {
  const scientificName = species.scientific_name?.trim().toLowerCase()

  if (!scientificName) return DEFAULT_SPECIES_HERO_IMAGE

  return SPECIES_HERO_IMAGES_BY_SCIENTIFIC_NAME[scientificName] ?? DEFAULT_SPECIES_HERO_IMAGE
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
