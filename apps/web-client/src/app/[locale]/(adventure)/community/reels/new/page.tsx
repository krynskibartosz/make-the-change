import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AdventurePageFrame } from '../../_features/adventure-page-frame'
import { ReelCreateForm } from '../_features/reel-create-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('reels.new_meta_title'),
  }
}

export default function CommunityReelsCreatePage() {
  return (
    <AdventurePageFrame centerClassName="max-w-[760px]">
      <ReelCreateForm />
    </AdventurePageFrame>
  )
}
