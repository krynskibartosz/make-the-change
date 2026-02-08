/**
 * Utilitaires pour l'optimisation et le crop d'images
 * Utilise l'API Canvas native du navigateur (zéro dépendance)
 */

export interface ImageConfig {
  aspectRatio: number
  maxWidth: number
  maxHeight: number
  quality: number
  maxSize: number // en bytes
}

export const IMAGE_CONFIGS: Record<'hero' | 'avatar' | 'gallery', ImageConfig> = {
  hero: {
    aspectRatio: 16 / 9,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    maxSize: 2 * 1024 * 1024, // 2 Mo
  },
  avatar: {
    aspectRatio: 1, // Carré
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.9,
    maxSize: 500 * 1024, // 500 Ko
  },
  gallery: {
    aspectRatio: 4 / 3,
    maxWidth: 1200,
    maxHeight: 900,
    quality: 0.85,
    maxSize: 1 * 1024 * 1024, // 1 Mo
  },
}

/**
 * Crop une image selon un aspect ratio
 * @param file - Fichier image original
 * @param aspectRatio - Ratio (ex: 16/9, 1/1, 4/3)
 * @returns Promise<File> - Fichier croppé
 */
export async function cropImage(file: File, aspectRatio: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      const { width, height } = img
      const currentRatio = width / height

      let cropWidth = width
      let cropHeight = height
      let offsetX = 0
      let offsetY = 0

      if (currentRatio > aspectRatio) {
        // Image trop large, crop horizontal (centré)
        cropWidth = height * aspectRatio
        offsetX = (width - cropWidth) / 2
      } else {
        // Image trop haute, crop vertical (centré)
        cropHeight = width / aspectRatio
        offsetY = (height - cropHeight) / 2
      }

      canvas.width = cropWidth
      canvas.height = cropHeight

      // Dessiner l'image croppée
      ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob failed'))
            return
          }

          const croppedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
            type: 'image/jpeg',
          })

          resolve(croppedFile)
        },
        'image/jpeg',
        0.95, // Qualité élevée pour le crop
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Compresse et redimensionne une image
 * @param file - Fichier image original
 * @param maxWidth - Largeur max
 * @param maxHeight - Hauteur max
 * @param quality - Qualité JPEG (0-1)
 * @returns Promise<File> - Fichier optimisé
 */
export async function optimizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Calculer nouvelles dimensions (garde aspect ratio)
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Redimensionner
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Convertir en Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob failed'))
            return
          }

          // Créer nouveau File
          const optimizedFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, '.jpg'), // Force JPEG
            { type: 'image/jpeg' },
          )

          resolve(optimizedFile)
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Pipeline complet : crop + optimize
 * @param file - Fichier image original
 * @param config - Configuration (aspect ratio, dimensions, qualité)
 * @returns Promise<{file: File, originalSize: number, optimizedSize: number, reduction: number}>
 */
export async function processImage(
  file: File,
  config: ImageConfig,
  options?: {
    skipCrop?: boolean
  },
): Promise<{
  file: File
  originalSize: number
  optimizedSize: number
  reduction: number
}> {
  const originalSize = file.size

  // 1. Crop selon aspect ratio (sauf si déjà recadré)
  const cropped = options?.skipCrop ? file : await cropImage(file, config.aspectRatio)

  // 2. Optimiser (resize + compress)
  const optimized = await optimizeImage(cropped, config.maxWidth, config.maxHeight, config.quality)

  const optimizedSize = optimized.size
  const reduction = Math.round(((originalSize - optimizedSize) / originalSize) * 100)

  return {
    file: optimized,
    originalSize,
    optimizedSize,
    reduction,
  }
}

/**
 * Convertir un File en Data URL
 * @param file - Fichier à convertir
 * @returns Promise<string> - Data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Formater une taille en bytes vers une chaîne lisible
 * @param bytes - Taille en bytes
 * @returns string - Taille formatée (ex: "1.2 Mo")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 octets'

  const k = 1024
  const sizes = ['octets', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}
