'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Camera, ImageIcon, Loader2 } from 'lucide-react'
import { type RefObject, useMemo, useRef, useState } from 'react'

import { cn } from '@make-the-change/core/shared/utils'

import { GalleryImageItem } from './gallery-image-item'
import { ImageGalleryModal } from './image-gallery-modal'

export type EntityGallerySectionProps = {
  title?: string
  description?: string
  hint?: string
  images: string[]
  maxImages?: number
  isProcessing?: boolean
  onUpload: (files: FileList | null) => void
  onRemove: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onPreview?: (index: number) => void
  isDisabled?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  status?: 'todo' | 'in_progress' | 'complete'
  statusText?: string
  variant?: 'card' | 'plain'
  className?: string
}

export function EntityGallerySection({
  title,
  description,
  hint,
  images,
  maxImages = 15,
  isProcessing = false,
  onUpload,
  onRemove,
  onReorder,
  onPreview,
  isDisabled = false,
  inputRef,
  status,
  statusText,
  variant = 'card',
  className,
}: EntityGallerySectionProps) {
  const internalInputRef = inputRef ?? useRef<HTMLInputElement | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const computedTitle = title ?? "Galerie d'images"
  const computedDescription =
    description ??
    "Ajoutez jusqu'à 15 images pour présenter le projet. Formats acceptés : JPG, PNG, WebP (max 5MB)."

  const remainingSlots = useMemo(
    () => Math.max(0, maxImages - images.length),
    [images.length, maxImages],
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = images.indexOf(active.id as string)
      const newIndex = images.indexOf(over?.id as string)

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex)
      }
    }
  }

  const handlePreview = (index: number) => {
    setPreviewIndex(index)
    onPreview?.(index)
  }

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">{computedTitle}</h3>
        <p className="text-xs text-muted-foreground">{computedDescription}</p>
      </div>

      {images.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className={cn('grid gap-4', 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4')}>
              {images.map((src, index) => (
                <GalleryImageItem
                  key={src}
                  id={src}
                  src={src}
                  index={index}
                  total={images.length}
                  onRemove={() => onRemove(index)}
                  onPreview={() => handlePreview(index)}
                />
              ))}

              {/* Bouton d'ajout "Card" à la fin de la grille */}
              {remainingSlots > 0 && (
                <button
                  type="button"
                  onClick={() => internalInputRef.current?.click()}
                  disabled={isProcessing || isDisabled}
                  className={cn(
                    'group relative flex aspect-4/3 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed border-muted-foreground/50 dark:border-border bg-muted/5 transition-all hover:bg-muted/10 hover:border-primary/50 cursor-pointer',
                    (isProcessing || isDisabled) && 'pointer-events-none opacity-50',
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:text-primary">
                    {isProcessing ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
                    Ajouter une photo
                  </span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        // Empty State
        <div
          onClick={() => internalInputRef.current?.click()}
          className={cn(
            'group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/50 dark:border-border bg-muted/5 px-6 py-16 text-center transition-all hover:bg-muted/10 hover:border-primary/50 cursor-pointer',
            (isProcessing || isDisabled) && 'pointer-events-none opacity-50',
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110">
            <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            Ajouter des images
          </p>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
            Glissez-déposez vos fichiers ici ou cliquez pour parcourir.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded-full border',
            remainingSlots === 0
              ? 'bg-warning/10 text-warning border-warning/20'
              : 'bg-muted text-muted-foreground border-transparent',
          )}
        >
          {images.length} / {maxImages}
        </span>
      </div>

      <input
        ref={internalInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        disabled={isProcessing || isDisabled || images.length >= maxImages}
        onChange={(event) => {
          const files = event.target.files
          onUpload(files)
          event.target.value = ''
        }}
      />

      {/* Image Preview Modal */}
      <ImageGalleryModal
        images={images}
        initialIndex={previewIndex ?? 0}
        isOpen={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
      />
    </div>
  )

  if (variant === 'plain') {
    return <div className={cn('space-y-4', className)}>{content}</div>
  }

  // Card Variant
  return (
    <div className={cn('rounded-3xl border border-border/50 bg-card p-6 shadow-sm', className)}>
      {content}
    </div>
  )
}
