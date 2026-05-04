export type ProjectMapSourceProject = {
  id: string | null
  slug: string | null
  name_default: string | null
  description_default?: string | null
  address_city: string | null
  address_country_code: string | null
  latitude: number | null
  longitude: number | null
  hero_image_url: string | null
  current_funding: number | null
  type: string | null
  unit_label: string | null
}

export type ProjectMapImpactKind = 'beehive' | 'orchard' | 'reef'

export type ProjectMapImpactDisplay = {
  value: number
  label: string
  kind: ProjectMapImpactKind
}

export type ProjectMapFeatureProperties = {
  id: string
  slug: string
  name: string
  description: string
  location: string
  imageUrl: string | null
  projectType: string
  unitLabel: string | null
  impactValue: number
  impactLabel: string
  impactKind: ProjectMapImpactKind
}

export type ProjectMapFeature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: ProjectMapFeatureProperties
}

export type ProjectMapFeatureCollection = {
  type: 'FeatureCollection'
  features: ProjectMapFeature[]
}

const BEEHIVE_REFERENCE_VALUE_EUR = 1300
const BEEHIVE_REFERENCE_POPULATION = 50000
const BEES_PER_EUR = BEEHIVE_REFERENCE_POPULATION / BEEHIVE_REFERENCE_VALUE_EUR

const OLIVE_PRICE_EUR = 150
const CORAL_PRICE_EUR = 30

export function buildProjectMapFeatureCollection(
  projects: ProjectMapSourceProject[],
): ProjectMapFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: projects.flatMap((project, index) => {
      if (!hasValidCoordinates(project)) {
        return []
      }

      const id = project.id || project.slug || `project-${index}`
      const slug = project.slug || id
      const impact = getProjectImpactDisplay(project)

      return [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [project.longitude, project.latitude],
          },
          properties: {
            id,
            slug,
            name: project.name_default || 'Projet mystère',
            description: project.description_default || '',
            location: getProjectLocation(project),
            imageUrl: project.hero_image_url,
            projectType: project.type || 'beehive',
            unitLabel: project.unit_label,
            impactValue: impact.value,
            impactLabel: impact.label,
            impactKind: impact.kind,
          },
        },
      ]
    }),
  }
}

export function getProjectImpactDisplay(project: {
  current_funding: number | null
  type: string | null
}): ProjectMapImpactDisplay {
  const funding = Number.isFinite(project.current_funding) ? project.current_funding || 0 : 0
  const projectType = project.type || 'beehive'

  if (projectType === 'orchard' || projectType === 'olive_tree') {
    return {
      value: Math.round(funding / OLIVE_PRICE_EUR),
      label: funding > 0 ? 'oliviers protégés' : 'Collecte en cours de démarrage',
      kind: 'orchard',
    }
  }

  if (projectType === 'reef' || projectType === 'coral') {
    return {
      value: Math.round(funding / CORAL_PRICE_EUR),
      label: funding > 0 ? 'coraux plantés' : 'Collecte en cours de démarrage',
      kind: 'reef',
    }
  }

  return {
    value: Math.round(funding * BEES_PER_EUR),
    label: funding > 0 ? 'abeilles protégées' : 'Collecte en cours de démarrage',
    kind: 'beehive',
  }
}

export function getProjectLocation(project: {
  address_city: string | null
  address_country_code: string | null
}): string {
  const locationParts = [project.address_city, project.address_country_code].filter(
    (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0,
  )

  return locationParts.length > 0 ? locationParts.join(', ') : 'Localisation mystère'
}

function hasValidCoordinates(
  project: ProjectMapSourceProject,
): project is ProjectMapSourceProject & { latitude: number; longitude: number } {
  return (
    typeof project.latitude === 'number' &&
    typeof project.longitude === 'number' &&
    Number.isFinite(project.latitude) &&
    Number.isFinite(project.longitude) &&
    project.latitude >= -90 &&
    project.latitude <= 90 &&
    project.longitude >= -180 &&
    project.longitude <= 180
  )
}
