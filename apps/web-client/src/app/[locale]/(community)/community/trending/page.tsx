import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

type CommunityTrendingPageProps = {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    contributors?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('trending.meta_title'),
  }
}

export default async function CommunityTrendingPage({
  params,
  searchParams,
}: CommunityTrendingPageProps) {
  const [{ locale }, { contributors }] = await Promise.all([params, searchParams])
  const query = new URLSearchParams({ sort: 'best' })

  if (contributors) {
    query.set('contributors', contributors)
  }

  redirect(`/${locale}/community?${query.toString()}`)
}
