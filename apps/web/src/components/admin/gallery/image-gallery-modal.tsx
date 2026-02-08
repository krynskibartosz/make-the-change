'use client'

import { Button } from '@make-the-change/core/ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@make-the-change/core/shared/utils'

type ImageGalleryModalProps = {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageGalleryModal({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Derived valid index
  const validIndex = useMemo(() => {
    if (images.length === 0) return -1
    return Math.max(0, Math.min(currentIndex, images.length - 1))
  }, [currentIndex, images.length])

  // Close if no images
  useEffect(() => {
    if (isOpen && images.length === 0) {
      onClose()
    }
  }, [images.length, isOpen, onClose])

  // Navigation
  const navigateTo = useCallback(
    (index: number) => {
      if (images.length === 0) return
      let newIndex = index
      if (index < 0) newIndex = images.length - 1
      if (index >= images.length) newIndex = 0
      setCurrentIndex(newIndex)
    },
    [images.length],
  )

  const goToPrevious = useCallback(() => {
    navigateTo(currentIndex - 1)
  }, [currentIndex, navigateTo])

  const goToNext = useCallback(() => {
    navigateTo(currentIndex + 1)
  }, [currentIndex, navigateTo])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape': {
          onClose()
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          goToPrevious()
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          goToNext()
          break
        }
      }
    },
    [isOpen, goToPrevious, goToNext, onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!mounted || !isOpen || images.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Fermer</span>
        </Button>

        {/* Previous button */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-20 h-12 w-12 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110 hidden md:flex"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Précédente</span>
          </Button>
        )}

        {/* Main Image */}
        <div className="relative flex h-full max-h-[85vh] w-full max-w-7xl items-center justify-center">
          {validIndex >= 0 && validIndex < images.length && (
            <div className="relative h-full w-full">
              <Image
                fill
                priority
                alt={`Image ${validIndex + 1} sur ${images.length}`}
                className="object-contain"
                src={images[validIndex] ?? ''}
                sizes="100vw"
              />
            </div>
          )}
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-20 h-12 w-12 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110 hidden md:flex"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Suivante</span>
          </Button>
        )}

        {/* Footer info */}
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform flex flex-col items-center gap-4">
          {/* Counter */}
          <div className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/5">
            {validIndex + 1} / {images.length}
          </div>

          {/* Thumbnails (only if multiple images) */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-[90vw] p-2 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={cn(
                    'relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer',
                    index === validIndex
                      ? 'scale-110 border-white shadow-lg'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/30',
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateTo(index)
                  }}
                >
                  <Image
                    fill
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover"
                    src={image}
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
