import { getTranslations } from 'next-intl/server'
import { CreatePostPageClient } from '@/components/social/create-post-page-client'

export async function generateMetadata() {
  const t = await getTranslations('community')
  return {
    title: t('create_post.meta_title'),
  }
}

export default function CommunityCreatePostPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <CreatePostPageClient />
    </div>
  )
}
