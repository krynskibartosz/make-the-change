import type { ShareChannel } from '@make-the-change/core/shared'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { buildPublicAppUrl } from '@/lib/public-url'
import { recordShareEvent } from '@/lib/social/feed.actions'
import { getComments, getPostById } from '@/lib/social/feed.reads'
import { CommunityPostThreadContent } from './_features/community-post-thread-content'

type CommunityPostPageProps = {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{
    share_token?: string
    share_channel?: string
  }>
}

const SHARE_CHANNELS = new Set([
  'copy',
  'x',
  'linkedin',
  'facebook',
  'native',
  'whatsapp',
  'telegram',
  'email',
  'reddit',
  'embed',
  'internal_quote',
])

const sanitizeShareChannel = (value: string | undefined): ShareChannel =>
  SHARE_CHANNELS.has(value || '') ? (value as ShareChannel) : 'copy'

const trimToLength = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`
}

export async function generateMetadata({ params }: CommunityPostPageProps): Promise<Metadata> {
  const { locale, id } = await params
  const post = await getPostById(id)
  const t = await getTranslations('community')
  const isIndexable = post?.visibility === 'public'
  const title = post?.content
    ? trimToLength(post.content, 80)
    : trimToLength(t('post.default_title'), 80)
  const description = post?.content
    ? trimToLength(post.content, 170)
    : t('post.share_fallback_title')
  const canonicalUrl = buildPublicAppUrl(`/${locale}/community/posts/${id}`)
  const ogImageUrl = buildPublicAppUrl(`/api/og/community/post/${id}?variant=default`)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function CommunityPostPage({ params, searchParams }: CommunityPostPageProps) {
  const { locale, id } = await params
  const query = await searchParams
  const [post, comments] = await Promise.all([getPostById(id), getComments(id)])
  if (!post) {
    notFound()
  }

  const shareToken = query.share_token?.trim()
  if (shareToken) {
    try {
      const requestHeaders = await headers()
      await recordShareEvent({
        postId: post.id,
        channel: sanitizeShareChannel(query.share_channel),
        eventType: 'landing',
        shareToken,
        targetUrl: buildPublicAppUrl(`/${locale}/community/posts/${post.id}`),
        referrer: requestHeaders.get('referer'),
        userAgent: requestHeaders.get('user-agent'),
      })
    } catch {
      // Landing analytics are best-effort.
    }
  }

  return (
    <CommunityPostThreadContent
      postId={id}
      mode="page"
      initialPost={post}
      initialComments={comments}
    />
  )
}
