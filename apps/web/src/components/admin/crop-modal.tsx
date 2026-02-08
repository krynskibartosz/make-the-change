'use client'

import { Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Area } from 'react-easy-crop'

import { BaseCropModal } from '@/components/admin/media/base-crop-modal'

type CropModalProps = {
  image: {
    type: 'hero' | 'avatar'
    src: string
    file: File
  } | null
  crop: { x: number; y: number }
  zoom: number
  rotation: number
  isSaving: boolean
  onCropChange: (crop: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  onRotationChange: (rotation: number) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  onConfirm: () => void
  onCancel: () => void
}

export function CropModal({
  image,
  crop,
  zoom,
  rotation,
  isSaving,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  onConfirm,
  onCancel,
}: CropModalProps) {
  const t = useTranslations()

  if (!image) return null

  const isHero = image.type === 'hero'

  return (
    <BaseCropModal
      image={image}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      aspect={isHero ? 16 / 9 : 1}
      cropShape={isHero ? 'rect' : 'round'}
      showGrid={isHero}
      isSaving={isSaving}
      headerTitle={
        isHero
          ? t('admin.projects.crop.title_cover', {
              defaultValue: 'Ajuster la couverture',
            })
          : t('admin.projects.crop.title_avatar', {
              defaultValue: "Ajuster l'avatar",
            })
      }
      zoomLabel={t('admin.projects.crop.zoom', { defaultValue: 'Zoom' })}
      rotationLabel={t('admin.projects.crop.rotation', {
        defaultValue: 'Rotation',
      })}
      resetRotationLabel={t('admin.projects.crop.reset', {
        defaultValue: 'Reset',
      })}
      onCropChange={onCropChange}
      onZoomChange={onZoomChange}
      onRotationChange={onRotationChange}
      onCropComplete={onCropComplete}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={t('admin.projects.crop.confirm', {
        defaultValue: 'Confirmer',
      })}
      confirmIcon={<Camera className="mr-2 h-4 w-4" />}
      cancelLabel={t('admin.projects.crop.cancel', { defaultValue: 'Annuler' })}
    />
  )
}
