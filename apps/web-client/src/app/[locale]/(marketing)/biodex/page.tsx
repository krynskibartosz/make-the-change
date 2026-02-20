import { getTranslations } from 'next-intl/server'
import { toSpecies } from '@/app/[locale]/(marketing)/biodex/_features/species-parsers'
import { createClient } from '@/lib/supabase/server'
import { BiodexClient } from './biodex-client'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing_pages.biodex.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function BiodexPage() {
  const supabase = await createClient()
  const t = await getTranslations('marketing_pages.biodex')

  const { data: species, error } = await supabase
    .schema('investment')
    .from('species')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching species:', error)
  }

  const speciesList = Array.isArray(species)
    ? species
      .map((entry) => toSpecies(entry))
      .filter((entry): entry is NonNullable<ReturnType<typeof toSpecies>> => entry !== null)
    : []

  return (
    <>
      <section className="pb-12 pt-0 md:pb-16 md:pt-2">
        <BiodexClient species={speciesList} />
      </section>
    </>
  )
}
