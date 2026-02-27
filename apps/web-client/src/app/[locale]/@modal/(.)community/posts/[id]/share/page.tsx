import { getLocale, getTranslations } from 'next-intl/server'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { COMMUNITY_SHARE_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { CommunityPostShareContent } from '@/app/[locale]/(community)/community/posts/[id]/share/_features/community-post-share-content'

type InterceptedCommunityPostSharePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedCommunityPostSharePage({
  params,
}: InterceptedCommunityPostSharePageProps) {
  const [{ id }, locale, t] = await Promise.all([
    params,
    getLocale(),
    getTranslations('community'),
  ])

  return (
    <InterceptedRouteDialog
      title={t('share.title')}
      contentClassName={COMMUNITY_SHARE_MODAL_CONTENT_CLASSNAME}
      fallbackHref="/community"
    >
      <CommunityPostShareContent postId={id} locale={locale} mode="modal" />
    </InterceptedRouteDialog>
  )
}
