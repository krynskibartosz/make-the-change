import { Button } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function CommunityNotFound() {
  const t = await getTranslations('community')

  return (
    <div className="mx-auto flex min-h-[45vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-sm text-muted-foreground">{t('trending.no_trending')}</p>
      <Button asChild className="min-h-11 px-5">
        <Link href="/community">{t('actions.back_to_feed')}</Link>
      </Button>
    </div>
  )
}
