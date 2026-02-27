import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PostCard } from '@/components/social/post-card'
import { Link } from '@/i18n/navigation'
import { buildPublicAppUrl } from '@/lib/public-url'
import { getPostPublicById } from '@/lib/social/feed.reads'

type CommunityPostEmbedPageProps = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: CommunityPostEmbedPageProps): Promise<Metadata> {
  const { locale, id } = await params
  const post = await getPostPublicById(id)
  const t = await getTranslations('community')

  return {
    title: post?.content?.slice(0, 80) || t('post.default_title'),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: buildPublicAppUrl(`/${locale}/community/posts/${id}`),
    },
  }
}

export default async function CommunityPostEmbedPage({ params }: CommunityPostEmbedPageProps) {
  const { id } = await params
  const t = await getTranslations('community')
  const post = await getPostPublicById(id)

  if (!post) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-2xl bg-background p-3">
      <PostCard post={post} readonlyActions postHref={`/community/posts/${post.id}`} />
      <div className="px-3 pb-2 pt-3 text-center text-xs text-muted-foreground">
        <Link
          href={`/community/posts/${post.id}`}
          prefetch={false}
          className="hover:text-foreground hover:underline"
        >
          {t('share.open_original_post')}
        </Link>
      </div>
    </main>
  )
}
