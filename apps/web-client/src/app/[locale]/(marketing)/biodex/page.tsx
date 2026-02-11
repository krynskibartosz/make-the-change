import { Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import type { Species } from '@/features/biodex/types'
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

  return (
    <>
      <PageHero
        badge={
          <span className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 animate-pulse text-primary" />
            {t('badge')}
          </span>
        }
        title={t('title')}
        description={t('description')}
        size="lg"
        variant="gradient"
      >
        <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden opacity-20">
          <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-marketing-positive-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[30%] w-[30%] rounded-full bg-primary/20 blur-[100px]" />
        </div>
      </PageHero>

      <SectionContainer size="lg" className="relative -mt-12 z-20">
        <BiodexClient species={(species || []) as Species[]} />
      </SectionContainer>
    </>
  )
}
