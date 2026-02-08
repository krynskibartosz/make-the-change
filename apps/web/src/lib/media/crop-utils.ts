/**
 * Utilitaires pour le crop d'images avec react-easy-crop
 */

export type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Crée une image HTML depuis une source (URL ou DataURL)
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Pour éviter les problèmes CORS
    image.src = url;
  });

/**
 * Convertit des degrés en radians
 */
function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Calcule les nouvelles dimensions d'un rectangle après rotation
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Extrait une zone croppée d'une image et retourne un Blob
 *
 * @param imageSrc - URL ou DataURL de l'image source
 * @param pixelCrop - Zone à extraire en pixels (depuis react-easy-crop)
 * @param rotation - Angle de rotation en degrés (optionnel, défaut: 0)
 * @param flip - Flip horizontal/vertical (optionnel)
 * @returns Promise<Blob> - Blob de l'image croppée en format JPEG
 *
 * @example
 * const blob = await getCroppedImg(imageDataUrl, croppedAreaPixels, 0);
 * const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Impossible de créer un contexte 2D pour le canvas');
  }

  const rotRad = getRadianAngle(rotation);

  // Calculer les dimensions du canvas en tenant compte de la rotation
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Définir la taille du canvas pour la rotation
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Appliquer les transformations
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Dessiner l'image complète avec rotation
  ctx.drawImage(image, 0, 0);

  // Récupérer les pixels de l'image transformée
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Impossible de créer un contexte 2D pour le canvas croppé');
  }

  // Définir la taille du canvas final (zone croppée)
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Dessiner la zone croppée
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convertir en Blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas vide - impossible de créer le blob'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.95); // Qualité 95% pour un bon compromis taille/qualité
  });
}

/**
 * Version alternative qui retourne un DataURL au lieu d'un Blob
 * Utile pour l'affichage immédiat sans conversion
 *
 * @param imageSrc - URL ou DataURL de l'image source
 * @param pixelCrop - Zone à extraire en pixels
 * @param rotation - Angle de rotation en degrés (optionnel)
 * @returns Promise<string> - DataURL de l'image croppée
 */
export async function getCroppedImgAsDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const blob = await getCroppedImg(imageSrc, pixelCrop, rotation);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Erreur de lecture du blob'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Vérifie si une zone de crop est valide
 */
export function isValidCropArea(area: Area | null | undefined): area is Area {
  return (
    !!area &&
    typeof area.x === 'number' &&
    typeof area.y === 'number' &&
    typeof area.width === 'number' &&
    typeof area.height === 'number' &&
    area.width > 0 &&
    area.height > 0
  );
}
