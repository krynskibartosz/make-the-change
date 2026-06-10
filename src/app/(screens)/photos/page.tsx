'use client'

import { useEffect, useState } from 'react'
import type { Photo } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockClarusRepository.getPhotos().then((data) => {
      setPhotos(data)
      setLoading(false)
    })
  }, [])

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Galerie de photos">
      <section className="flex-1 overflow-y-auto pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Chargement des photos...
          </div>
        ) : photos.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Aucune photo trouvée.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-alt group cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.comment ?? 'Photo du chantier'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if mock image doesn't exist
                    ;(e.target as HTMLImageElement).src =
                      `https://placehold.co/400x400/e2e8f0/1e293b?text=${photo.type || 'Photo'}`
                  }}
                />
                {(photo.comment || photo.type) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 flex flex-col justify-end">
                    {photo.type && (
                      <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">
                        {photo.type}
                      </span>
                    )}
                    {photo.comment && (
                      <p className="text-xs text-white line-clamp-1">{photo.comment}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Prendre une photo
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
