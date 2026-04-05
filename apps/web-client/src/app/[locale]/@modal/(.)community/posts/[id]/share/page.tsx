import { getLocale, getTranslations } from 'next-intl/server'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { COMMUNITY_SHARE_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { AdventurePostShareContent } from '@/app/[locale]/(adventure)/community/posts/[id]/share/_features/adventure-post-share-content'

type InterceptedAdventurePostSharePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedAdventurePostSharePage({
  params,
}: InterceptedAdventurePostSharePageProps) {
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
      <AdventurePostShareContent postId={id} locale={locale} mode="modal" />
    </InterceptedRouteDialog>
  )
}
