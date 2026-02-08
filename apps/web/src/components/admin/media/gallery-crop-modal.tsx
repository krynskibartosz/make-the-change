'use client'

import { Button } from '@make-the-change/core/ui'
import { Camera, SkipForward } from 'lucide-react'
import type { Area } from 'react-easy-crop'
import { BaseCropModal } from '@/components/admin/media/base-crop-modal'

type GalleryCropModalProps = {
  image: {
    file: File
    src: string
    index: number
  } | null
  totalImages: number
  currentIndex: number
  crop: { x: number; y: number }
  zoom: number
  rotation: number
  isSaving: boolean
  onCropChange: (crop: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  onRotationChange: (rotation: number) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  onConfirm: () => void
  onSkip: () => void
  onCancel: () => void
}

export function GalleryCropModal({
  image,
  totalImages,
  currentIndex,
  crop,
  zoom,
  rotation,
  isSaving,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  onConfirm,
  onSkip,
  onCancel,
}: GalleryCropModalProps) {
  return (
    <BaseCropModal
      image={image}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      aspect={16 / 9}
      cropShape="rect"
      showGrid
      isSaving={isSaving}
      headerTitle="Ajuster l'image de galerie"
      headerBadge={
        image && (
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {currentIndex} / {totalImages}
          </div>
        )
      }
      progress={{ current: currentIndex, total: totalImages }}
      onCropChange={onCropChange}
      onZoomChange={onZoomChange}
      onRotationChange={onRotationChange}
      onCropComplete={onCropComplete}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Confirmer"
      confirmIcon={<Camera className="mr-2 h-4 w-4" />}
      cancelLabel="Tout annuler"
      secondaryActions={
        totalImages > 1 && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={isSaving}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Passer
          </Button>
        )
      }
    />
  )
}
