'use client'

import { ChevronLeft, ChevronRight, Images, Leaf, Play, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { sanitizeImageUrl } from '@/lib/image-url'
import { cn } from '@/lib/utils'
import { ProjectShareButton } from '../project-share-button'

type ProjectQuickViewHeroProps = {
  coverImage?: string
  media: string[]
  projectId: string
  projectName: string
  projectSlug: string
}

type MediaItem = {
  kind: 'image' | 'video'
  src: string
}

export function ProjectQuickViewHero({
  coverImage,
  media,
  projectId,
  projectName,
  projectSlug,
}: ProjectQuickViewHeroProps) {
  const mediaItems = useMemo(() => buildMediaItems(media, coverImage), [coverImage, media])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasGallery = mediaItems.length > 0
  const activeMedia = mediaItems[activeIndex]
  const hasMultipleMedia = mediaItems.length > 1
  const hasVideos = mediaItems.some((m) => m.kind === 'video')
  const hasMixedMedia = hasVideos && mediaItems.some((m) => m.kind === 'image')

  const galleryLabel =
    mediaItems.length === 1
      ? mediaItems[0]?.kind === 'video'
        ? 'Voir la vidéo'
        : 'Voir la photo'
      : hasMixedMedia
        ? 'Voir les médias'
        : hasVideos
          ? `Voir les ${mediaItems.length} vidéos`
          : `Voir les ${mediaItems.length} photos`

  const mediaTypeLabel = activeMedia?.kind === 'video' ? 'Vidéo' : 'Photo'

  const openGalleryAt = (index: number) => {
    if (!mediaItems.length) return
    setActiveIndex(index)
    setControlsVisible(true)
    setIsGalleryOpen(true)
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % mediaItems.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      setControlsVisible((v) => !v)
    } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && hasMultipleMedia) {
      if (diffX > 0) showNext()
      else showPrevious()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <>
      <section>
        <div className="relative aspect-[4/3] max-h-[320px] overflow-hidden bg-muted/40">
          <button
            type="button"
            onClick={() => openGalleryAt(0)}
            disabled={!hasGallery}
            className={cn(
              'absolute inset-0 z-0 block h-full w-full overflow-hidden text-left',
              hasGallery ? 'cursor-zoom-in' : 'cursor-default',
            )}
            aria-label={
              hasGallery ? `Ouvrir la galerie de ${projectName}` : `Illustration de ${projectName}`
            }
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={projectName}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                <Leaf className="h-16 w-16 text-primary/50" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          </button>

          {hasGallery ? (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Images className="h-3.5 w-3.5" />
              <span>{galleryLabel}</span>
            </div>
          ) : null}

          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <div onClick={(event) => event.stopPropagation()}>
              <ProjectShareButton projectName={projectName} projectSlug={projectSlug} />
            </div>
          </div>
        </div>
      </section>

      {mounted &&
        isGalleryOpen &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-black h-[100dvh] text-white animate-in fade-in duration-200">
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 transition-opacity duration-200',
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{projectName}</p>
                <p className="text-xs text-white/50">
                  {mediaItems.length > 0
                    ? `${mediaTypeLabel} · ${activeIndex + 1} / ${mediaItems.length}`
                    : 'Galerie'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                aria-label="Fermer la galerie"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 active:bg-white/30"
              >
                <X className="h-5 w-5 text-white/80" />
              </button>
            </div>

            {/* Media */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {activeMedia ? (
                activeMedia.kind === 'video' ? (
                  <video
                    key={activeMedia.src}
                    className="max-h-full max-w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={activeMedia.src} type={getVideoMimeType(activeMedia.src)} />
                    Votre navigateur ne prend pas en charge la lecture video.
                  </video>
                ) : (
                  <img
                    key={activeMedia.src}
                    src={activeMedia.src}
                    alt={`${projectName} ${activeIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                )
              ) : null}

              {hasMultipleMedia ? (
                <div
                  className={cn(
                    'transition-opacity duration-200',
                    controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                >
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Media précédent"
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white transition-colors hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Media suivant"
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white transition-colors hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Thumbnails */}
            {hasMultipleMedia ? (
              <div
                className={cn(
                  'border-t border-white/10 px-4 py-3 transition-opacity duration-200',
                  controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
                )}
              >
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {mediaItems.map((item, index) => (
                    <button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all',
                        index === activeIndex
                          ? 'border-lime-400 ring-2 ring-lime-400/50'
                          : 'border-white/10 opacity-70 hover:opacity-100',
                      )}
                      aria-label={`Voir le media ${index + 1}`}
                    >
                      {item.kind === 'video' ? (
                        <>
                          <video
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          >
                            <source src={item.src} type={getVideoMimeType(item.src)} />
                          </video>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.src}
                          alt={`${projectName} miniature ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>,
          document.body,
        )}
    </>
  )
}

function isVideoMedia(source: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(source)
}

function getVideoMimeType(source: string): string {
  const normalized = source.toLowerCase()
  if (normalized.endsWith('.mov')) return 'video/quicktime'
  if (normalized.endsWith('.webm')) return 'video/webm'
  if (normalized.endsWith('.ogg')) return 'video/ogg'
  if (normalized.endsWith('.m4v')) return 'video/x-m4v'
  return 'video/mp4'
}

function buildMediaItems(media: string[], coverImage?: string): MediaItem[] {
  const seen = new Set<string>()
  const sources = [coverImage, ...media]
    .map((entry) => sanitizeImageUrl(entry))
    .filter((entry): entry is string => Boolean(entry))

  const items: MediaItem[] = []

  for (const source of sources) {
    if (seen.has(source)) continue
    seen.add(source)
    items.push({
      kind: isVideoMedia(source) ? 'video' : 'image',
      src: source,
    })
  }

  return items
}
