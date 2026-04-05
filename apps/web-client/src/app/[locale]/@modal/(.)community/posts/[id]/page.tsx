import { getTranslations } from 'next-intl/server'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { COMMUNITY_POST_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { AdventurePostThreadContent } from '@/app/[locale]/(adventure)/community/posts/[id]/_features/adventure-post-thread-content'

type InterceptedCommunityPostPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedCommunityPostPage({
  params,
}: InterceptedCommunityPostPageProps) {
  const { id } = await params
  const t = await getTranslations('community')

  return (
    <InterceptedRouteDialog
      title={t('post.default_title')}
      contentClassName={COMMUNITY_POST_MODAL_CONTENT_CLASSNAME}
      fallbackHref="/community"
    >
      <AdventurePostThreadContent postId={id} mode="modal" />
    </InterceptedRouteDialog>
  )
}
