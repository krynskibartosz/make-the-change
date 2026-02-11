const BROKEN_UNSPLASH_PHOTO_IDS = new Set([
  '1602143407151-0111419516eb',
  '1474979266404-7cadd259d366',
])

const UNSPLASH_HOSTNAMES = new Set(['images.unsplash.com', 'source.unsplash.com'])

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

    return trimmed
  } catch {
    return trimmed
  }
}
