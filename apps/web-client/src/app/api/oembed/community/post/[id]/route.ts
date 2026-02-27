import { buildPublicAppUrl } from '@/lib/public-url'
import { getPostEmbedData } from '@/lib/social/feed.reads'

const clampDimension = (
  value: string | null,
  { min, max, fallback }: { min: number; max: number; fallback: number },
) => {
  const parsed = Number.parseInt(value || '', 10)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, parsed))
}

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const normalizeLocale = (value: string | null) =>
  value === 'fr' || value === 'nl' || value === 'en' ? value : 'en'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const embedData = await getPostEmbedData(id)

  if (!embedData) {
    return Response.json(
      { error: 'Post not found' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    )
  }

  const { searchParams } = new URL(request.url)
  const maxWidth = clampDimension(searchParams.get('maxwidth'), {
    min: 320,
    max: 1200,
    fallback: 640,
  })
  const maxHeight = clampDimension(searchParams.get('maxheight'), {
    min: 280,
    max: 1200,
    fallback: 460,
  })
  const locale = normalizeLocale(searchParams.get('locale'))
  const embedUrl = buildPublicAppUrl(`/${locale}/embed/community/posts/${id}`)
  const title = escapeAttribute(embedData.title)

  const html = `<iframe src="${embedUrl}" width="${maxWidth}" height="${maxHeight}" style="border:0;overflow:hidden;border-radius:12px;max-width:100%;" loading="lazy" allowfullscreen title="${title}"></iframe>`

  return Response.json(
    {
      version: '1.0',
      type: 'rich',
      provider_name: 'Make the Change',
      provider_url: buildPublicAppUrl('/'),
      title: embedData.title,
      author_name: embedData.author_name,
      width: maxWidth,
      height: maxHeight,
      html,
      thumbnail_url: embedData.image_url || embedData.og_image_url,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  )
}
