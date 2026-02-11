import { getTranslations } from 'next-intl/server'
import { FaqContent } from './faq-content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing_pages.faq.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function FaqPage() {
  return <FaqContent />
}
