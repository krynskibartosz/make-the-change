'use client'

import { Button } from '@make-the-change/core/ui'
import { useTranslations } from 'next-intl'
import { CommunityPageFrameClient } from '../../../_features/community-page-frame-client'

export default function CommunityPostShareError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('community')

  return (
    <CommunityPageFrameClient
      sidebarUser={null}
      rightRail={
        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-60 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      }
    >
      <div className="mx-auto flex min-h-[45vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-semibold">{t('create_post.error_title')}</h2>
        <p className="max-w-xl text-sm text-muted-foreground">{error.message}</p>
        <Button type="button" onClick={reset} className="min-h-11 px-5">
          {t('actions.retry')}
        </Button>
      </div>
    </CommunityPageFrameClient>
  )
}
