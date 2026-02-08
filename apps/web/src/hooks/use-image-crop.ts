'use client';

import { useCallback, useState } from 'react';
import type { Area } from 'react-easy-crop';

import { useToast } from '@/hooks/use-toast';
import {
  processImage,
  fileToDataUrl,
  formatFileSize,
  IMAGE_CONFIGS,
  type ImageConfig,
} from '@/lib/media/image-utils';
import { getCroppedImg } from '@/lib/media/crop-utils';

export type CropTaskType = 'hero' | 'avatar' | 'gallery';

export type CropTask = {
  type: CropTaskType;
  src: string;
  file: File;
};

export type CropState = {
  x: number;
  y: number;
};

export type ImageCropConfig = {
  /** Taille maximale pour les images de type hero (en bytes) */
  maxSizeHero?: number;
  /** Taille maximale pour les images de type avatar (en bytes) */
  maxSizeAvatar?: number;
  /** Taille maximale pour les images de type gallery (en bytes) */
  maxSizeGallery?: number;
  /** Callback appelé après un crop réussi */
  onCropSuccess?: (dataUrl: string, type: CropTaskType) => void;
  /** Callback appelé en cas d'erreur */
  onError?: (error: Error, type: CropTaskType) => void;
};

export type ImageCropReturn = {
  // États
  cropTask: CropTask | null;
  crop: CropState;
  zoom: number;
  rotation: number;
  croppedAreaPixels: Area | null;
  isLoading: Record<CropTaskType, boolean>;
  isSaving: boolean;

  // Setters
  setCrop: (crop: CropState) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setCroppedAreaPixels: (area: Area | null) => void;

  // Actions
  selectImage: (type: CropTaskType, fileList: FileList | null) => Promise<void>;
  confirmCrop: () => Promise<void>;
  cancelCrop: () => void;
  resetCrop: () => void;
};

const DEFAULT_MAX_SIZE_HERO = 10 * 1024 * 1024; // 10 MB
const DEFAULT_MAX_SIZE_AVATAR = 5 * 1024 * 1024; // 5 MB
const DEFAULT_MAX_SIZE_GALLERY = 10 * 1024 * 1024; // 10 MB

/**
 * Hook pour gérer l'upload et le crop d'images (hero/avatar/gallery)
 *
 * Fonctionnalités :
 * - Validation des fichiers (type, taille)
 * - Conversion en DataURL pour preview
 * - Crop interactif avec zoom et rotation
 * - Optimisation automatique de l'image finale
 * - Toast notifications pour feedback utilisateur
 */
export function useImageCrop(config: ImageCropConfig = {}): ImageCropReturn {
  const {
    maxSizeHero = DEFAULT_MAX_SIZE_HERO,
    maxSizeAvatar = DEFAULT_MAX_SIZE_AVATAR,
    maxSizeGallery = DEFAULT_MAX_SIZE_GALLERY,
    onCropSuccess,
    onError,
  } = config;

  const { toast } = useToast();

  // États du crop
  const [cropTask, setCropTask] = useState<CropTask | null>(null);
  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // États de chargement
  const [isLoading, setIsLoading] = useState<Record<CropTaskType, boolean>>({
    hero: false,
    avatar: false,
    gallery: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Réinitialise tous les états du crop
   */
  const resetCrop = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  }, []);

  /**
   * Valide un fichier image
   */
  const validateFile = useCallback(
    (file: File, type: CropTaskType): string | null => {
      // Vérifier le type MIME
      if (!file.type.startsWith('image/')) {
        return 'Veuillez sélectionner une image (JPG, PNG, WebP, etc.)';
      }

      // Vérifier la taille
      let maxSize = maxSizeGallery;
      if (type === 'hero') maxSize = maxSizeHero;
      if (type === 'avatar') maxSize = maxSizeAvatar;

      if (file.size > maxSize) {
        return `La taille maximale est de ${formatFileSize(maxSize)}.`;
      }

      return null;
    },
    [maxSizeHero, maxSizeAvatar, maxSizeGallery]
  );

  /**
   * Sélectionne une image et ouvre la modale de crop
   */
  const selectImage = useCallback(
    async (type: CropTaskType, fileList: FileList | null) => {
      const file = fileList?.[0];
      if (!file) return;

      // Validation
      const validationError = validateFile(file, type);
      if (validationError) {
        toast({
          title: 'Fichier invalide',
          description: validationError,
          variant: 'destructive',
        });
        return;
      }

      // Début du chargement
      setIsLoading((prev) => ({ ...prev, [type]: true }));

      try {
        // Conversion en DataURL pour preview
        const dataUrl = await fileToDataUrl(file);

        // Ouvrir la modale de crop
        setCropTask({
          type,
          src: dataUrl,
          file,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erreur inconnue');
        toast({
          title: 'Erreur de chargement',
          description: err.message,
          variant: 'destructive',
        });
        onError?.(err, type);
      } finally {
        setIsLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [validateFile, toast, onError]
  );

  /**
   * Confirme le crop et traite l'image
   */
  const confirmCrop = useCallback(async () => {
    if (!cropTask || !croppedAreaPixels) {
      toast({
        title: 'Erreur de crop',
        description: 'Aucune zone de crop définie',
        variant: 'destructive',
      });
      return;
    }

    const { type, file, src } = cropTask;
    let imageConfig: ImageConfig;
    switch (type) {
      case 'hero':
        imageConfig = IMAGE_CONFIGS.hero;
        break;
      case 'avatar':
        imageConfig = IMAGE_CONFIGS.avatar;
        break;
      case 'gallery':
        imageConfig = IMAGE_CONFIGS.gallery;
        break;
      default:
        imageConfig = IMAGE_CONFIGS.gallery;
    }

    setIsSaving(true);

    try {
      // 1. Extraire le blob croppé
      const croppedBlob = await getCroppedImg(src, croppedAreaPixels, rotation);

      // 2. Créer un File depuis le blob
      const croppedFile = new File(
        [croppedBlob],
        file.name.replace(/\.\w+$/, '-cropped.jpg'),
        { type: 'image/jpeg' }
      );

      // 3. Optimiser l'image croppée
      const result = await processImage(croppedFile, imageConfig, {
        skipCrop: true, // Déjà croppé manuellement
      });

      // 4. Vérifier la taille finale
      if (result.optimizedSize > imageConfig.maxSize) {
        toast({
          title: 'Image trop volumineuse',
          description: `Même après optimisation, l'image dépasse ${formatFileSize(
            imageConfig.maxSize
          )}.`,
          variant: 'destructive',
        });
        return;
      }

      // 5. Convertir en DataURL
      const dataUrl = await fileToDataUrl(result.file);

      // 6. Notification de succès
      let title = 'Image ajoutée';
      if (type === 'hero') title = '📸 Couverture ajoutée';
      if (type === 'avatar') title = '🪪 Avatar ajouté';
      
      toast({
        title,
        description: `Optimisé : ${formatFileSize(result.originalSize)} → ${formatFileSize(
          result.optimizedSize
        )} (-${result.reduction}%)`,
      });

      // 7. Callback de succès
      onCropSuccess?.(dataUrl, type);

      // 8. Fermer et réinitialiser
      resetCrop();
      setCropTask(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erreur inconnue');
      toast({
        title: "Erreur d'optimisation",
        description: err.message,
        variant: 'destructive',
      });
      onError?.(err, type);
    } finally {
      setIsSaving(false);
    }
  }, [cropTask, croppedAreaPixels, rotation, toast, onCropSuccess, onError, resetCrop]);

  /**
   * Annule le crop et ferme la modale
   */
  const cancelCrop = useCallback(() => {
    if (isSaving) return; // Empêcher la fermeture pendant la sauvegarde

    resetCrop();
    setCropTask(null);
  }, [isSaving, resetCrop]);

  return {
    // États
    cropTask,
    crop,
    zoom,
    rotation,
    croppedAreaPixels,
    isLoading,
    isSaving,

    // Setters
    setCrop,
    setZoom,
    setRotation,
    setCroppedAreaPixels,

    // Actions
    selectImage,
    confirmCrop,
    cancelCrop,
    resetCrop,
  };
}
