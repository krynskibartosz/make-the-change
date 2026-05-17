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

import {
  getProjectImpactDisplay as getImpactFromLib,
  type ImpactDisplay,
  type ImpactKind,
} from '@/lib/impact-calculator'

// Re-export pour compatibilité
export type ProjectMapImpactKind = ImpactKind
export type ProjectMapImpactDisplay = ImpactDisplay

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

export type ProjectFocusCameraOptions = {
  center: [number, number]
  zoom: number
  offset: [number, number]
  duration: number
}

const PROJECT_FOCUS_MIN_ZOOM = 6
const PROJECT_FOCUS_VERTICAL_OFFSET = -200
const PROJECT_FOCUS_DURATION_MS = 480

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
  const base = getImpactFromLib(project)
  const funding = Number.isFinite(project.current_funding) ? project.current_funding || 0 : 0

  // Enrichir avec le fallback "Collecte en cours" quand pas de funding
  return {
    value: base.value,
    label: funding > 0 ? base.label : 'Collecte en cours de démarrage',
    kind: base.kind,
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

export function getProjectFocusCameraOptions(
  coordinates: [number, number],
  currentZoom: number,
): ProjectFocusCameraOptions {
  return {
    center: coordinates,
    zoom: Math.max(currentZoom, PROJECT_FOCUS_MIN_ZOOM),
    offset: [0, PROJECT_FOCUS_VERTICAL_OFFSET],
    duration: PROJECT_FOCUS_DURATION_MS,
  }
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
