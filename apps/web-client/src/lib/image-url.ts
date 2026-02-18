const BROKEN_UNSPLASH_PHOTO_IDS = new Set([
  '1602143407151-0111419516eb',
  '1474979266404-7cadd259d366',
  '1478482745029-779d72462198',
])

const UNSPLASH_HOSTNAMES = new Set(['images.unsplash.com', 'source.unsplash.com'])

/** Unsplash query params that conflict with Next.js Image Optimization */
const UNSPLASH_STRIP_PARAMS = new Set(['q', 'w', 'h', 'fit', 'auto', 'crop', 'fm', 'cs', 'dl'])

export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (typeof url !== 'string') {
    return null
  }

  const trimmed = url.trim()
  if (!trimmed) {
    return null
  }

  try {
    const parsed = new URL(trimmed)
    if (!UNSPLASH_HOSTNAMES.has(parsed.hostname)) {
      return trimmed
    }

    for (const photoId of BROKEN_UNSPLASH_PHOTO_IDS) {
      if (parsed.pathname.includes(photoId) || parsed.href.includes(photoId)) {
        return null
      }
    }

    // Strip Unsplash-specific query params — Next.js Image handles sizing/quality
    for (const param of UNSPLASH_STRIP_PARAMS) {
      parsed.searchParams.delete(param)
    }

    return parsed.toString()
  } catch {
    return trimmed
  }
}
