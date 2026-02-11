import type { BlogPostContent, TipTapDoc, TipTapNode } from '../blog-types'

const SCRIPT_TAG_PATTERN = /<script[\s\S]*?>[\s\S]*?<\/script>/gi
const STYLE_TAG_PATTERN = /<style[\s\S]*?>[\s\S]*?<\/style>/gi
const HTML_TAG_PATTERN = /<\/?[^>]+>/g
const LINE_BREAK_PATTERN = /<(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi
const LI_OPEN_PATTERN = /<li[^>]*>/gi
const IS_HTML_PATTERN = /<\/?[a-z][\s\S]*>/i

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const sanitizeTipTapNode = (value: unknown): TipTapNode | null => {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return null
  }

  const content = Array.isArray(value.content)
    ? value.content.map(sanitizeTipTapNode).filter((node): node is TipTapNode => node !== null)
    : undefined

  const marks = Array.isArray(value.marks)
    ? value.marks
        .filter(isRecord)
        .map((mark) => ({
          type: typeof mark.type === 'string' ? mark.type : '',
          attrs: isRecord(mark.attrs) ? mark.attrs : undefined,
        }))
        .filter((mark) => mark.type.length > 0)
    : undefined

  return {
    type: value.type,
    attrs: isRecord(value.attrs) ? value.attrs : undefined,
    text: typeof value.text === 'string' ? value.text : undefined,
    marks,
    content,
  }
}

const isTipTapDoc = (value: unknown): value is TipTapDoc => {
  if (!isRecord(value) || value.type !== 'doc') {
    return false
  }

  if (value.content !== undefined && !Array.isArray(value.content)) {
    return false
  }

  return true
}

const decodeHtmlEntities = (value: string): string => {
  let decoded = value
  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    decoded = decoded.split(entity).join(replacement)
  }
  return decoded
}

const convertHtmlToSafeText = (value: string): string => {
  const withoutScripts = value.replace(SCRIPT_TAG_PATTERN, ' ').replace(STYLE_TAG_PATTERN, ' ')
  const withBreaks = withoutScripts
    .replace(LI_OPEN_PATTERN, '- ')
    .replace(LINE_BREAK_PATTERN, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
  const withoutTags = withBreaks.replace(HTML_TAG_PATTERN, ' ')
  const decoded = decodeHtmlEntities(withoutTags)

  return decoded
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

const legacyText = (value: string): BlogPostContent => ({
  kind: 'legacyText',
  text: value,
})

const parseSerializedJson = (value: string): unknown | null => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const parseBlogContent = (rawContent: unknown): BlogPostContent => {
  if (rawContent === null || rawContent === undefined) {
    return legacyText('')
  }

  if (isTipTapDoc(rawContent)) {
    const sanitizedNodes = Array.isArray(rawContent.content)
      ? rawContent.content
          .map(sanitizeTipTapNode)
          .filter((node): node is TipTapNode => node !== null)
      : []

    return {
      kind: 'tiptap',
      doc: {
        type: 'doc',
        content: sanitizedNodes,
      },
    }
  }

  if (typeof rawContent === 'string') {
    const trimmed = rawContent.trim()
    if (!trimmed) {
      return legacyText('')
    }

    const jsonValue = parseSerializedJson(trimmed)
    if (jsonValue && isTipTapDoc(jsonValue)) {
      return parseBlogContent(jsonValue)
    }

    if (IS_HTML_PATTERN.test(trimmed)) {
      return legacyText(convertHtmlToSafeText(trimmed))
    }

    return legacyText(trimmed)
  }

  if (isRecord(rawContent) || Array.isArray(rawContent)) {
    return legacyText(JSON.stringify(rawContent))
  }

  return legacyText(String(rawContent))
}

export const blogContentToText = (content: BlogPostContent): string => {
  if (content.kind === 'legacyText') {
    return content.text
  }

  const extractNodeText = (node: TipTapNode): string => {
    if (node.type === 'text') {
      return node.text ?? ''
    }

    if (!Array.isArray(node.content)) {
      return ''
    }

    return node.content.map(extractNodeText).join(' ')
  }

  return (content.doc.content ?? [])
    .map((node) => extractNodeText(node))
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
