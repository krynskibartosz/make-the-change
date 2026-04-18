'use client'

import { Button, Dialog, DialogContent } from '@make-the-change/core/ui'
import { ChevronLeft, ChevronRight, Images, Leaf, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sanitizeImageUrl } from '@/lib/image-url'
import { cn } from '@/lib/utils'
import { ProjectFavoriteButton } from '../project-favorite-button'
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

const isVideoMedia = (source: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(source)

const getVideoMimeType = (source: string) => {
  const normalized = source.toLowerCase()
  if (normalized.endsWith('.mov')) return 'video/quicktime'
  if (normalized.endsWith('.webm')) return 'video/webm'
  if (normalized.endsWith('.ogg')) return 'video/ogg'
  if (normalized.endsWith('.m4v')) return 'video/x-m4v'
  return 'video/mp4'
}

const buildMediaItems = (media: string[], coverImage?: string): MediaItem[] => {
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

  const hasGallery = mediaItems.length > 0
  const activeMedia = mediaItems[activeIndex]
  const hasMultipleMedia = mediaItems.length > 1
  const galleryLabel =
    mediaItems.length > 1
      ? `${mediaItems.length} medias`
      : mediaItems[0]?.kind === 'video'
        ? 'Voir la video'
        : 'Voir l image'

  const openGalleryAt = (index: number) => {
    if (!mediaItems.length) return
    setActiveIndex(index)
    setIsGalleryOpen(true)
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % mediaItems.length)
  }

  return (
    <>
      <section>
        <div className="relative h-48 overflow-hidden bg-muted/40 sm:h-56">
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </button>

          {hasGallery ? (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Images className="h-3.5 w-3.5" />
              <span>{galleryLabel}</span>
            </div>
          ) : null}

          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <div onClick={(event) => event.stopPropagation()}>
              <ProjectShareButton
                projectName={projectName}
                projectSlug={projectSlug}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 hover:bg-black/70"
              />
            </div>
            <div onClick={(event) => event.stopPropagation()}>
              <ProjectFavoriteButton
                projectName={projectName}
                projectId={projectId}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 hover:bg-black/70"
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent
          size="full"
          closeLabel="Fermer la galerie"
          className="h-[100dvh] max-h-[100dvh] w-[100vw] max-w-[100vw] rounded-none border-0 bg-black/95 p-0 text-white shadow-none"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{projectName}</p>
                <p className="text-xs text-white/60">
                  {mediaItems.length > 0 ? `${activeIndex + 1} / ${mediaItems.length}` : 'Galerie'}
                </p>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-4 sm:px-6">
              {activeMedia ? (
                activeMedia.kind === 'video' ? (
                  <video
                    key={activeMedia.src}
                    className="max-h-full max-w-full rounded-3xl object-contain"
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
                    className="max-h-full max-w-full rounded-3xl object-contain"
                  />
                )
              ) : null}

              {hasMultipleMedia ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={showPrevious}
                    className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/15 bg-black/45 text-white hover:bg-black/70 hover:text-white"
                    aria-label="Media precedent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={showNext}
                    className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/15 bg-black/45 text-white hover:bg-black/70 hover:text-white"
                    aria-label="Media suivant"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              ) : null}
            </div>

            {hasMultipleMedia ? (
              <div className="border-t border-white/10 px-4 py-3">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {mediaItems.map((item, index) => (
                    <button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition-all',
                        index === activeIndex
                          ? 'border-lime-400 ring-2 ring-lime-400/50'
                          : 'border-white/10 opacity-70 hover:opacity-100',
                      )}
                      aria-label={`Voir le media ${index + 1}`}
                    >
                      {item.kind === 'video' ? (
                        <>
                          <video className="h-full w-full object-cover" muted playsInline preload="metadata">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
