'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, GripVertical, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@make-the-change/core/shared/utils'

export type GalleryImageItemProps = {
  src: string
  index: number
  total: number
  onRemove: (index: number) => void
  onPreview?: (index: number) => void
  id: string // Add id prop for dnd-kit
}

/**
 * Item d'image réutilisable pour les galeries
 *
 * - Drag & drop avec dnd-kit
 * - Boutons d'action (preview, delete)
 * - Style glassmorphism
 */
export function GalleryImageItem({
  src,
  index,
  total,
  onRemove,
  onPreview,
  id,
}: GalleryImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group relative aspect-4/3 touch-none', isDragging && 'z-50 opacity-50')}
    >
      <div className="h-full w-full overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute left-3 top-3 z-20 flex cursor-grab active:cursor-grabbing items-center gap-1 rounded-full bg-background/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-foreground border border-border/20 shadow-sm transition-all hover:bg-background/80"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" aria-hidden />
          <span>{index + 1}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{total}</span>
        </div>

        {/* Image preview */}
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={`Image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-105 pointer-events-none"
          />
        </div>

        {/* Overlay actions */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="m-3 flex items-center justify-between gap-2 rounded-2xl bg-background/80 px-3 py-2 text-xs backdrop-blur-md border border-white/10 shadow-lg">
            <span className="font-medium text-foreground truncate max-w-[100px]">{`Image ${index + 1}`}</span>
            <div className="flex items-center gap-1">
              {onPreview && (
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onPreview(index)}
                  aria-label={`Prévisualiser l'image ${index + 1}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                onClick={() => onRemove(index)}
                aria-label={`Supprimer l'image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
