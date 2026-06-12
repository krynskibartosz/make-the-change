'use client'

import { Camera, CheckCircle2, Filter, MapPin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Photo, PhotoType } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { useRole } from '@/lib/role-context'
import executionCheckPhoto from '../../../../assets/plan/IMG_2580.jpeg'
import existingSurveyPhoto from '../../../../assets/plan/IMG_2581.jpeg'
import p17DetailPhoto from '../../../../assets/plan/IMG_2583.jpeg'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'
import { getClientPhotoPresentation, getVisiblePhotosForRole } from './client-photo-presentation'

type FilterType = 'all' | 'before' | 'during' | 'after'

const PHOTO_TYPE_LABELS: Readonly<Record<PhotoType, string>> = {
  before: 'Avant les travaux',
  during: 'Travaux en cours',
  after: 'Après les travaux',
  problem: 'Point à contrôler',
  proof: 'Preuve du chantier',
  material: 'Matériau',
  waste: 'Évacuation des déchets',
  plan: 'Plan du chantier',
  receipt: 'Justificatif',
  other: 'Suivi du chantier',
}

const CLIENT_PHOTO_SOURCES = {
  'existing-survey': existingSurveyPhoto.src,
  'execution-check': executionCheckPhoto.src,
  'p17-detail': p17DetailPhoto.src,
} as const

export default function PhotosPage() {
  const router = useRouter()
  const { role, isReady } = useRole()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [failedPhotoIds, setFailedPhotoIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    mockClarusRepository.getPhotos().then((data) => {
      setPhotos(
        [...data].sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()),
      )
      setLoading(false)
    })
  }, [])

  const visiblePhotos = useMemo(
    () => getVisiblePhotosForRole(photos, role).filter((photo) => !failedPhotoIds.has(photo.id)),
    [photos, role, failedPhotoIds],
  )

  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all') return visiblePhotos
    return visiblePhotos.filter((photo) => photo.type === activeFilter)
  }, [visiblePhotos, activeFilter])

  const groupedPhotos = useMemo(() => {
    const groups: Record<string, Photo[]> = {}
    for (const photo of filteredPhotos) {
      const date = new Date(photo.takenAt)
      const dateLabel = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      const capitalizedDateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
      groups[capitalizedDateLabel] ??= []
      groups[capitalizedDateLabel].push(photo)
    }
    return groups
  }, [filteredPhotos])

  const selectedPresentation =
    role === 'client' && selectedPhoto ? getClientPhotoPresentation(selectedPhoto) : null

  function hideFailedPhoto(photoId: string) {
    setFailedPhotoIds((current) => new Set(current).add(photoId))
    if (selectedPhoto?.id === photoId) setSelectedPhoto(null)
  }

  function renderFilter(type: FilterType, label: string) {
    return (
      <button
        type="button"
        onClick={() => setActiveFilter(type)}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeFilter === type
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-surface-elevated text-muted-foreground'
        }`}
      >
        {label}
      </button>
    )
  }

  if (!isReady) return null

  return (
    <>
      <FullScreenSlideModal
        asPage
        headerMode="back"
        title={role === 'client' ? 'Photos validées' : 'Photos'}
      >
        <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+100px)]">
          {role === 'client' ? (
            <div className="border-b border-border bg-emerald-500/10 px-4 py-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold">
                    {visiblePhotos.length} photos validées par le chef de chantier
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Chaque image est reliée à une étape et à une zone de votre chantier.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-border bg-background/90 p-4 pb-3 backdrop-blur-md">
            {renderFilter('all', 'Toutes')}
            {renderFilter('before', 'Avant')}
            {renderFilter('during', 'En cours')}
            {renderFilter('after', 'Après')}
          </div>

          <section className="space-y-8 p-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Chargement des photos...
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center gap-4 text-muted-foreground">
                <Filter className="size-10 text-muted-foreground/30" />
                <p>Aucune photo validée pour ce filtre.</p>
              </div>
            ) : (
              Object.entries(groupedPhotos).map(([dateLabel, datePhotos]) => (
                <div key={dateLabel} className="space-y-3">
                  <h2 className="sticky top-[72px] z-10 bg-background/90 py-2 text-lg font-semibold backdrop-blur-md">
                    {dateLabel}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {datePhotos.map((photo) => {
                      const presentation =
                        role === 'client' ? getClientPhotoPresentation(photo) : null
                      const caption = presentation?.caption ?? photo.comment ?? 'Suivi du chantier'
                      const phaseLabel = presentation?.phaseLabel ?? PHOTO_TYPE_LABELS[photo.type]
                      const photoSource = presentation
                        ? CLIENT_PHOTO_SOURCES[presentation.assetKey]
                        : photo.url

                      return (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => setSelectedPhoto(photo)}
                          className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-alt text-left transition-transform active:scale-[0.98]"
                          aria-label={`Ouvrir la photo : ${caption}`}
                        >
                          <img
                            src={photoSource}
                            alt={caption}
                            className="h-full w-full object-cover"
                            onError={() => hideFailedPhoto(photo.id)}
                          />
                          <span className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2 pt-10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                              {phaseLabel}
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-white">
                              {caption}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {role !== 'client' ? (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/90 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] backdrop-blur-md">
            <div className="mx-auto flex max-w-md gap-3">
              <button
                type="button"
                onClick={() => router.push('/photos/ajouter')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <Camera className="size-5" />
                Prendre une photo
              </button>
            </div>
          </div>
        ) : null}
      </FullScreenSlideModal>

      {selectedPhoto ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
          <div className="flex items-center justify-between p-4 text-white safe-area-pt">
            <div className="flex min-w-0 flex-col pr-3">
              <span className="text-sm font-semibold">
                {new Date(selectedPhoto.takenAt).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-xs text-white/60">
                {role === 'client' ? 'Validée par le chef de chantier' : 'Auteur inconnu'}
              </span>
            </div>
            <button
              type="button"
              aria-label="Fermer la photo"
              onClick={() => setSelectedPhoto(null)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors active:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
            <img
              src={
                selectedPresentation
                  ? CLIENT_PHOTO_SOURCES[selectedPresentation.assetKey]
                  : selectedPhoto.url
              }
              alt={selectedPresentation?.caption ?? selectedPhoto.comment ?? 'Photo du chantier'}
              className="max-h-full max-w-full rounded-lg object-contain"
              onError={() => hideFailedPhoto(selectedPhoto.id)}
            />
          </div>

          <div className="space-y-4 bg-gradient-to-t from-black to-transparent p-6 text-white safe-area-pb">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {selectedPresentation?.phaseLabel ?? PHOTO_TYPE_LABELS[selectedPhoto.type]}
              </span>
              {(selectedPresentation?.zoneLabel ?? selectedPhoto.zoneId) ? (
                <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-sm text-white/80">
                  <MapPin className="size-3.5" />
                  <span>{selectedPresentation?.zoneLabel ?? selectedPhoto.zoneId}</span>
                </div>
              ) : null}
            </div>
            <p className="text-base leading-relaxed">
              {selectedPresentation?.caption ??
                selectedPhoto.comment ??
                'Photo de suivi du chantier'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
