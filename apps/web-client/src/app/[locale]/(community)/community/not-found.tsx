import { Button } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CommunityPageFrame } from './_features/community-page-frame'
import { CommunityRightRail } from './_features/community-right-rail'

export default async function CommunityNotFound() {
  const t = await getTranslations('community')

  return (
    <CommunityPageFrame rightRail={<CommunityRightRail variant="default" />}>
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="text-sm text-muted-foreground">{t('trending.no_trending')}</p>
        <Button asChild className="min-h-11 px-5">
          <Link href="/community">{t('actions.back_to_feed')}</Link>
        </Button>
      </div>
    </CommunityPageFrame>
  )
}
