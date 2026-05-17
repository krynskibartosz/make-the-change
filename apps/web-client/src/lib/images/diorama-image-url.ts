const DIORAMA_PREFIX = '/images/dioramas/'
const TRANSPARENT_DIORAMA_PREFIX = '/images/dioramas/transparent/'

export function toTransparentDioramaImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith(TRANSPARENT_DIORAMA_PREFIX)) return imageUrl
  if (!imageUrl.startsWith(DIORAMA_PREFIX)) return imageUrl

  return `${TRANSPARENT_DIORAMA_PREFIX}${imageUrl.slice(DIORAMA_PREFIX.length)}`
}
