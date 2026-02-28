import { getTranslations } from 'next-intl/server'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { BiodexEnhanced } from './components/biodex-enhanced'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing_pages.biodex.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function BiodexPage() {
  const speciesList = await getSpeciesContextList()

  return (
    <>
      <section className="pb-12 pt-0 md:pb-16 md:pt-2">
        <BiodexEnhanced species={speciesList} />
      </section>
    </>
  )
}
