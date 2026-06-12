import type { Photo } from '@/lib/domain'
import type { AppRole } from '@/lib/role-context'

export type ClientPhotoPresentation = Readonly<{
  assetKey: 'existing-survey' | 'execution-check' | 'p17-detail'
  caption: string
  phaseLabel: string
  zoneLabel: string
}>

const CLIENT_PHOTO_PRESENTATIONS: Readonly<Record<string, ClientPhotoPresentation>> = {
  'photo-1': {
    assetKey: 'existing-survey',
    caption: "Relevé de l'existant avant intervention",
    phaseLabel: 'Avant les travaux',
    zoneLabel: 'Garage et semelle béton',
  },
  'photo-2': {
    assetKey: 'execution-check',
    caption: "Contrôle des dimensions sur le plan d'exécution",
    phaseLabel: 'Travaux en cours',
    zoneLabel: 'Dalle intérieure',
  },
  'photo-3': {
    assetKey: 'p17-detail',
    caption: 'Détail du renfort métallique P1.7',
    phaseLabel: 'Travaux en cours',
    zoneLabel: 'Structure principale du rez-de-chaussée',
  },
}

export function getVisiblePhotosForRole(photos: Photo[], role: AppRole): Photo[] {
  if (role !== 'client') return photos

  return photos.filter(
    (photo) => Boolean(CLIENT_PHOTO_PRESENTATIONS[photo.id]) && Boolean(photo.comment?.trim()),
  )
}

export function getClientPhotoPresentation(photo: Photo): ClientPhotoPresentation | null {
  return CLIENT_PHOTO_PRESENTATIONS[photo.id] ?? null
}
