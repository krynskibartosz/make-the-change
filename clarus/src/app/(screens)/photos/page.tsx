'use client'

import { Camera, Clock, Filter, ImageIcon, MapPin, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Photo } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

import { useRole } from '@/lib/role-context'

type FilterType = 'all' | 'before' | 'during' | 'after'

export default function PhotosPage() {
  const router = useRouter()
  const { role, isReady } = useRole()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    mockClarusRepository.getPhotos().then((data) => {
      // Sort by date descending
      setPhotos(data.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()))
      setLoading(false)
    })
  }, [])

  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all') return photos
    return photos.filter((p) => p.type === activeFilter)
  }, [photos, activeFilter])

  // Group photos by relative date (Today, Yesterday, Date)
  const groupedPhotos = useMemo(() => {
    const groups: Record<string, Photo[]> = {}
    filteredPhotos.forEach((photo) => {
      const date = new Date(photo.takenAt)
      const dateStr = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      const capitalizedDateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
      if (!groups[capitalizedDateStr]) {
        groups[capitalizedDateStr] = []
      }
      groups[capitalizedDateStr].push(photo)
    })
    return groups
  }, [filteredPhotos])

  const renderFilterBadge = (type: FilterType, label: string) => (
    <button
      type="button"
      onClick={() => setActiveFilter(type)}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        activeFilter === type
          ? 'bg-primary text-primary-foreground'
          : 'bg-surface-elevated text-muted-foreground border border-border'
      }`}
    >
      {label}
    </button>
  )

  if (!isReady) return null

  return (
    <>
      <FullScreenSlideModal asPage headerMode="back" title={role === 'client' ? "Photos validées" : "Photos"}>
        <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+100px)]">
          {/* Segmented Control / Filters */}
          <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border p-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {renderFilterBadge('all', 'Toutes')}
            {renderFilterBadge('before', 'Avant')}
            {renderFilterBadge('during', 'En cours')}
            {renderFilterBadge('after', 'Après')}
          </div>

          <section className="p-4 space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                Chargement des photos...
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-60 text-muted-foreground gap-4">
                <Filter className="size-10 text-muted-foreground/30" />
                <p>Aucune photo pour ce filtre.</p>
              </div>
            ) : (
              Object.entries(groupedPhotos).map(([dateLabel, datePhotos]) => (
                <div key={dateLabel} className="space-y-3">
                  <h3 className="font-semibold text-lg sticky top-[72px] bg-background/90 backdrop-blur-md py-2 z-10">
                    {dateLabel}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {datePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-alt cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        <img
                          src={photo.url}
                          alt={photo.comment ?? 'Photo du chantier'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              `https://placehold.co/400x400/e2e8f0/1e293b?text=${
                                photo.type || 'Photo'
                              }`
                          }}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-8 flex flex-col justify-end">
                          {photo.type && (
                            <span className="text-[10px] uppercase font-bold text-white/90 tracking-wider">
                              {photo.type === 'before' && 'Avant'}
                              {photo.type === 'during' && 'En cours'}
                              {photo.type === 'after' && 'Après'}
                            </span>
                          )}
                          {photo.comment && (
                            <p className="text-xs text-white line-clamp-1 mt-0.5 opacity-90">
                              {photo.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {/* Fixed Bottom CTA - Masqué pour le client en V1 */}
        {role !== 'client' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
            <div className="max-w-md mx-auto flex gap-3">
              <button
                onClick={() => router.push('/photos/ajouter')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                <Camera className="size-5" />
                Prendre une photo
              </button>
            </div>
          </div>
        )}
      </FullScreenSlideModal>

      {/* Lightbox / Full Screen View */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 safe-area-pt text-white">
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {new Date(selectedPhoto.takenAt).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-white/60 text-xs">
                {role === 'client' ? 'Validée par le chef de chantier' : 'Auteur inconnu'}
              </span>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 bg-white/10 rounded-full active:bg-white/20 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
            <img
              src={selectedPhoto.url}
              alt="Vue en grand"
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  `https://placehold.co/800x800/222/555?text=Aperçu`
              }}
            />
          </div>

          {/* Footer details */}
          <div className="p-6 safe-area-pb bg-gradient-to-t from-black to-transparent space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                {selectedPhoto.type === 'before' && 'Avant'}
                {selectedPhoto.type === 'during' && 'En cours'}
                {selectedPhoto.type === 'after' && 'Après'}
                {!selectedPhoto.type && 'Général'}
              </span>
              {selectedPhoto.zoneId && (
                <div className="flex items-center gap-1.5 text-white/80 text-sm bg-white/10 px-2.5 py-1 rounded-md">
                  <MapPin className="size-3.5" />
                  <span>{selectedPhoto.zoneId}</span>
                </div>
              )}
            </div>
            {selectedPhoto.comment ? (
              <p className="text-white text-base leading-relaxed">{selectedPhoto.comment}</p>
            ) : (
              <p className="text-white/50 text-sm italic">Aucun commentaire</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
