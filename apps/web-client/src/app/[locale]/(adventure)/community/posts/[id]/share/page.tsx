import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildPublicAppUrl } from '@/lib/public-url'
import { getPostById } from '@/lib/social/feed.reads'
import { AdventurePageFrame } from '../../../_features/adventure-page-frame'
import { AdventureRightRail } from '../../../_features/adventure-right-rail'
import { AdventurePostShareContent } from './_features/adventure-post-share-content'

type AdventurePostSharePageProps = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: AdventurePostSharePageProps): Promise<Metadata> {
  const { locale, id } = await params
  const post = await getPostById(id)
  const t = await getTranslations('community')
  const postUrl = buildPublicAppUrl(`/${locale}/community/posts/${id}`)
  const ogImageUrl = buildPublicAppUrl(`/api/og/community/post/${id}?variant=default`)
  const title = post?.content
    ? `${t('post.share_prefix')}: ${post.content.slice(0, 32)}`
    : t('post.share_default_title')

  return {
    title,
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      url: postUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [ogImageUrl],
    },
  }
}

export default async function AdventurePostSharePage({ params }: AdventurePostSharePageProps) {
  const { id, locale } = await params
  const post = await getPostById(id)

  return (
    <AdventurePageFrame rightRail={<AdventureRightRail variant="default" />}>
      <AdventurePostShareContent postId={id} locale={locale} mode="page" initialPost={post} />
    </AdventurePageFrame>
  )
}
