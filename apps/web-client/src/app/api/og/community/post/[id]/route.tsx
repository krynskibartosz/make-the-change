import { ImageResponse } from 'next/og'
import { getPostById } from '@/lib/social/feed.actions'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const post = await getPostById(id)

  const content = post?.content || 'Make the Change'
  const author = post?.author?.full_name || 'Community'
  const hashtags = (post?.hashtags || []).slice(0, 4)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, rgb(10, 61, 33) 0%, rgb(36, 120, 71) 42%, rgb(210, 236, 205) 100%)',
          color: '#0F172A',
          fontFamily: 'sans-serif',
          padding: '56px',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#ECFDF5' }}>Make the Change Community</div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 24,
            padding: '28px 32px',
          }}
        >
          <div
            style={{
              fontSize: 50,
              lineHeight: 1.1,
              fontWeight: 700,
              color: '#064E3B',
              maxHeight: 230,
              overflow: 'hidden',
            }}
          >
            {content}
          </div>

          <div style={{ fontSize: 26, color: '#166534' }}>par {author}</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {hashtags.map((slug) => (
              <div
                key={slug}
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#0F766E',
                  background: '#E6FFFA',
                  borderRadius: 999,
                  padding: '6px 12px',
                }}
              >
                #{slug}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 24, color: '#ECFDF5' }}>community.make-the-change.com</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
