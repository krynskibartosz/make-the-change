import { describe, expect, it } from 'vitest'
import {
  buildProjectMapFeatureCollection,
  getProjectFocusCameraOptions,
  getProjectImpactDisplay,
  type ProjectMapSourceProject,
} from './project-map-data'

const baseProject: ProjectMapSourceProject = {
  id: 'project-1',
  slug: 'bee-sanctuary',
  name_default: 'Bee sanctuary',
  description_default: 'A beehive conservation project',
  address_city: 'Brussels',
  address_country_code: 'BE',
  latitude: 50.8503,
  longitude: 4.3517,
  hero_image_url: 'https://example.com/bee.jpg',
  current_funding: 1300,
  type: 'beehive',
  unit_label: 'bee',
}

describe('project map data', () => {
  it('builds GeoJSON features only for projects with valid coordinates', () => {
    const collection = buildProjectMapFeatureCollection([
      baseProject,
      {
        ...baseProject,
        id: 'missing-latitude',
        slug: 'missing-latitude',
        latitude: null,
      },
      {
        ...baseProject,
        id: 'invalid-longitude',
        slug: 'invalid-longitude',
        longitude: 190,
      },
    ])

    expect(collection.features.length).toBe(1)
    expect(collection.features[0]?.geometry.coordinates).toEqual([4.3517, 50.8503])
    expect(collection.features[0]?.properties).toEqual({
      description: 'A beehive conservation project',
      id: 'project-1',
      imageUrl: 'https://example.com/bee.jpg',
      impactKind: 'beehive',
      name: 'Bee sanctuary',
      location: 'Brussels, BE',
      projectType: 'beehive',
      slug: 'bee-sanctuary',
      unitLabel: 'bee',
      impactValue: 1,
      impactLabel: 'ruches accompagnées',
    })
  })

  it('uses project type to compute compact map impact labels', () => {
    expect(getProjectImpactDisplay({ current_funding: 300, type: 'orchard' })).toEqual({
      value: 2,
      label: 'oliviers accompagnés',
      kind: 'orchard',
    })

    expect(getProjectImpactDisplay({ current_funding: 90, type: 'coral' })).toEqual({
      value: 3,
      label: 'fragments coralliens implantés',
      kind: 'reef',
    })

    expect(getProjectImpactDisplay({ current_funding: 0, type: 'beehive' })).toEqual({
      value: 0,
      label: 'Collecte en cours de démarrage',
      kind: 'beehive',
    })
  })

  it('keeps the selected project in focus without zooming out', () => {
    expect(getProjectFocusCameraOptions([4.3517, 50.8503], 2)).toEqual({
      center: [4.3517, 50.8503],
      zoom: 3.2,
      offset: [0, -200],
      duration: 480,
    })

    expect(getProjectFocusCameraOptions([4.3517, 50.8503], 5)).toEqual({
      center: [4.3517, 50.8503],
      zoom: 5,
      offset: [0, -200],
      duration: 480,
    })
  })
})
