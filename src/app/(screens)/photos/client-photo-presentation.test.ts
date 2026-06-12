import { describe, expect, it } from 'vitest'

import type { Photo } from '@/lib/domain'
import { getClientPhotoPresentation, getVisiblePhotosForRole } from './client-photo-presentation'

const photos: Photo[] = [
  {
    id: 'photo-1',
    projectId: 'project-1',
    zoneId: 'zone-garage',
    type: 'before',
    url: 'https://example.com/garage.jpg',
    comment: 'État initial avant démolition',
    takenAt: '2026-06-05T08:05:00.000Z',
  },
  {
    id: 'photo-2',
    projectId: 'project-1',
    zoneId: 'zone-sol-beton',
    type: 'during',
    url: 'https://example.com/dalle.jpg',
    comment: 'Coulage de la dalle en cours',
    takenAt: '2026-06-06T14:00:00.000Z',
  },
  {
    id: 'photo-ticket-lovemat',
    projectId: 'project-1',
    type: 'receipt',
    url: 'https://example.com/ticket.jpg',
    takenAt: '2026-06-08T11:32:00.000Z',
  },
]

describe('client photo presentation', () => {
  it('shows the client only explicitly approved and contextualized chantier photos', () => {
    expect(getVisiblePhotosForRole(photos, 'client').map((photo) => photo.id)).toEqual([
      'photo-1',
      'photo-2',
    ])
  })

  it('keeps the complete photo collection for every chantier role', () => {
    for (const role of ['ouvrier', 'chef', 'admin'] as const) {
      expect(getVisiblePhotosForRole(photos, role)).toEqual(photos)
    }
  })

  it('uses client-facing business captions and zone names', () => {
    expect(getClientPhotoPresentation(photos[0]!)).toEqual({
      assetKey: 'existing-survey',
      caption: "Relevé de l'existant avant intervention",
      phaseLabel: 'Avant les travaux',
      zoneLabel: 'Garage et semelle béton',
    })
  })
})
