const HASHTAG_REGEX = /(^|\s)#([A-Za-z0-9_]{2,40})\b/g

export const MAX_HASHTAGS_PER_POST = 8

const normalizeHashtag = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase()
    .trim()

export const sanitizeHashtagSlug = (value: string): string => normalizeHashtag(value)

export const extractHashtagsFromText = (content: string | null | undefined): string[] => {
  if (!content) {
    return []
  }

  const seen = new Set<string>()
  const results: string[] = []

  for (const match of content.matchAll(HASHTAG_REGEX)) {
    const raw = match[2]
    if (!raw) {
      continue
    }

    const slug = normalizeHashtag(raw)
    if (!slug || seen.has(slug)) {
      continue
    }

    seen.add(slug)
    results.push(slug)

    if (results.length >= MAX_HASHTAGS_PER_POST) {
      break
    }
  }

  return results
}

export const hashtagLabelFromSlug = (slug: string): string => slug.replace(/_/g, ' ')
