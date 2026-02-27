import { getTranslations } from 'next-intl/server'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { COMMUNITY_COMPOSER_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { CreatePostPageClient } from '@/components/social/create-post-page-client'
import { getPostById } from '@/lib/social/feed.reads'

type InterceptedCommunityCreatePostPageProps = {
  searchParams: Promise<{
    quote?: string
  }>
}

export default async function InterceptedCommunityCreatePostPage({
  searchParams,
}: InterceptedCommunityCreatePostPageProps) {
  const [query, t] = await Promise.all([searchParams, getTranslations('community')])
  const quotePostId = typeof query.quote === 'string' ? query.quote.trim() : ''
  const quotedPost = quotePostId ? await getPostById(quotePostId) : null

  return (
    <InterceptedRouteDialog
      title={t('create_post.heading')}
      contentClassName={COMMUNITY_COMPOSER_MODAL_CONTENT_CLASSNAME}
      fallbackHref="/community"
    >
      <div className="p-4 sm:p-5">
        <CreatePostPageClient
          quotePostId={quotePostId || undefined}
          quotedPost={quotedPost}
          renderMode="modal"
        />
      </div>
    </InterceptedRouteDialog>
  )
}
