'use client'

import { Button } from '@make-the-change/core/ui'
import { useTranslations } from 'next-intl'
import { CommunityPageFrameClient } from '../_features/community-page-frame-client'

export default function CommunityReelsError({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('community')

  return (
    <CommunityPageFrameClient sidebarUser={null} centerClassName="max-w-[760px]">
      <div className="flex h-[100svh] flex-col items-center justify-center gap-4 bg-black px-6 text-center">
        <p className="max-w-md text-sm text-white/85">{error.message || t('reels.load_error')}</p>
        <Button onClick={reset}>{t('actions.retry')}</Button>
      </div>
    </CommunityPageFrameClient>
  )
}
