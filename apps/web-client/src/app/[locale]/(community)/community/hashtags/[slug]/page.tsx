import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'

type CommunityHashtagPageProps = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({ params }: CommunityHashtagPageProps): Promise<Metadata> {
  const t = await getTranslations('community')
  const { slug } = await params
  const normalizedSlug = sanitizeHashtagSlug(slug)

  if (!normalizedSlug) {
    return {
      title: t('hashtags.meta_title'),
    }
  }

  return {
    title: t('hashtags.detail_meta_title', { slug: normalizedSlug }),
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function CommunityHashtagPage({ params }: CommunityHashtagPageProps) {
  const { locale, slug } = await params
  const normalizedSlug = sanitizeHashtagSlug(slug)

  if (!normalizedSlug) {
    notFound()
  }

  redirect(`/${locale}/community?tag=${encodeURIComponent(normalizedSlug)}&sort=best`)
}
