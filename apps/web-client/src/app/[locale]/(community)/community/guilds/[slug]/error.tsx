'use client'

import { Button } from '@make-the-change/core/ui'
import { useTranslations } from 'next-intl'

export default function CommunityGuildDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('community')

  return (
    <div className="mx-auto flex min-h-[45vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-semibold">{t('guilds.membership_error_title')}</h2>
      <p className="max-w-xl text-sm text-muted-foreground">{error.message}</p>
      <Button type="button" onClick={reset} className="min-h-11 px-5">
        {t('actions.retry')}
      </Button>
    </div>
  )
}
