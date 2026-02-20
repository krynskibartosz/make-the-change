import { getTranslations } from 'next-intl/server'
import { buildFaqViewModel } from './_features/faq.view-model'
import { FaqContent } from './_features/faq-content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing_pages.faq.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function FaqPage() {
  const t = await getTranslations('marketing_pages.faq')
  const viewModel = await buildFaqViewModel(t)

  return <FaqContent {...viewModel} />
}
