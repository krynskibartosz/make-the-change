'use client';

import { Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Area } from 'react-easy-crop';

import { BaseCropModal } from '@/components/admin/media/base-crop-modal';

type CropModalProps = {
  image: {
    type: 'hero' | 'avatar' | 'gallery';
    src: string;
    file: File;
  } | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  isSaving: boolean;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

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
  const t = useTranslations();

  if (!image) return null;

  const isHero = image.type === 'hero';
  const isGallery = image.type === 'gallery';
  const isAvatar = image.type === 'avatar';

  let aspect = 1;
  if (isHero) aspect = 16 / 9;
  if (isGallery) aspect = 4 / 3;

  let headerTitle = t('admin.crop.title_avatar', { defaultValue: "Ajuster l'avatar" });
  if (isHero) {
    headerTitle = t('admin.crop.title_cover', { defaultValue: 'Ajuster la couverture' });
  } else if (isGallery) {
    headerTitle = t('admin.crop.title_gallery', { defaultValue: 'Ajuster l\'image' });
  }

  return (
    <BaseCropModal
      image={image}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      aspect={aspect}
      cropShape={isAvatar ? 'round' : 'rect'}
      showGrid={!isAvatar}
      isSaving={isSaving}
      headerTitle={headerTitle}
      
      zoomLabel={t('admin.crop.zoom', { defaultValue: 'Zoom' })}
      rotationLabel={t('admin.crop.rotation', {
        defaultValue: 'Rotation',
      })}
      resetRotationLabel={t('admin.crop.reset', {
        defaultValue: 'Reset',
      })}
      onCropChange={onCropChange}
      onZoomChange={onZoomChange}
      onRotationChange={onRotationChange}
      onCropComplete={onCropComplete}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={t('admin.crop.confirm', {
        defaultValue: 'Confirmer',
      })}
      confirmIcon={<Camera className="mr-2 h-4 w-4" />}
      cancelLabel={t('admin.crop.cancel', { defaultValue: 'Annuler' })}
    />
  );
}
