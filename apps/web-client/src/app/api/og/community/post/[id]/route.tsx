import { ImageResponse } from 'next/og'
import { getPostPublicById } from '@/lib/social/feed.reads'

const OG_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

type OgVariant = 'default' | 'impact' | 'minimal'

const trimToLength = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`
}

const isHttpUrl = (value: string | undefined) =>
  typeof value === 'string' && /^https?:\/\//i.test(value.trim())

const resolveVariant = (request: Request): OgVariant => {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get('variant')
  if (variant === 'impact' || variant === 'minimal') {
    return variant
  }

  return 'default'
}

const renderFallbackImage = (content: string, author: string) =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '54px',
        background:
          'linear-gradient(135deg, rgba(6,78,59,1) 0%, rgba(11,112,93,1) 45%, rgba(220,252,231,1) 100%)',
        color: '#ECFDF5',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 700 }}>Make the Change Community</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 24,
          padding: '28px 34px',
          color: '#064E3B',
        }}
      >
        <div style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 700 }}>
          {trimToLength(content, 170)}
        </div>
        <div style={{ fontSize: 24, color: '#0F766E' }}>{author}</div>
      </div>
      <div style={{ fontSize: 22 }}>make-the-change.com</div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: OG_CACHE_HEADERS,
    },
  )

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const variant = resolveVariant(request)
  const post = await getPostPublicById(id)

  const content = trimToLength(post?.content || 'Make the Change Community', 210)
  const author = post?.author?.full_name || 'Community'
  const hashtags = (post?.hashtags || []).slice(0, 3)
  const heroImage = post?.image_urls?.[0]
  const showHeroImage = isHttpUrl(heroImage)
  const reactionsCount = post?.reactions_count || 0
  const commentsCount = post?.comments_count || 0
  const sharesCount = post?.shares_count || 0

  const overlayBackground =
    variant === 'impact'
      ? 'linear-gradient(180deg, rgba(6,95,70,0.28) 0%, rgba(6,78,59,0.85) 100%)'
      : variant === 'minimal'
        ? 'linear-gradient(180deg, rgba(6,78,59,0.12) 0%, rgba(6,78,59,0.78) 100%)'
        : 'linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(6,78,59,0.88) 100%)'

  try {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(132deg, rgba(5,46,22,1) 0%, rgba(6,78,59,1) 45%, rgba(167,243,208,1) 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {showHeroImage ? (
          <img
            src={heroImage}
            alt="Post image"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: showHeroImage ? overlayBackground : 'rgba(6,78,59,0.55)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '44px 52px',
            color: '#ECFDF5',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              Make the Change
            </div>
            <div style={{ display: 'flex', fontSize: 18, opacity: 0.9 }}>Community Post</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              background: 'rgba(255,255,255,0.92)',
              color: '#064E3B',
              borderRadius: 24,
              padding: '30px 34px',
              maxWidth: '90%',
            }}
          >
            <div style={{ display: 'flex', fontSize: 22, color: '#0F766E', fontWeight: 600 }}>
              {author}
            </div>
            <div style={{ display: 'flex', fontSize: 46, lineHeight: 1.08, fontWeight: 700 }}>
              {content}
            </div>
            {hashtags.length > 0 ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {hashtags.map((slug) => (
                  <div
                    key={slug}
                    style={{
                      display: 'flex',
                      fontSize: 18,
                      fontWeight: 600,
                      borderRadius: 999,
                      background: '#D1FAE5',
                      color: '#065F46',
                      padding: '5px 12px',
                    }}
                  >
                    #{slug}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: 20, fontSize: 19, fontWeight: 600 }}>
            <div style={{ display: 'flex' }}>{reactionsCount} likes</div>
            <div style={{ display: 'flex' }}>{commentsCount} comments</div>
            <div style={{ display: 'flex' }}>{sharesCount} shares</div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: OG_CACHE_HEADERS,
      },
    )
  } catch {
    return renderFallbackImage(content, author)
  }
}
