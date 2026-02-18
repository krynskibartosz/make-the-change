import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, MapPin, Tractor } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'producers' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function ProducersPage() {
  const supabase = await createClient()
  const t = await getTranslations('producers')

  const { data: producers } = await supabase
    .from('public_producers' as any)
    .select('*')
    .order('name_default') as any

  return (
    <>
      <PageHero
        title={t('intro_title')}
        description={t('intro_description')}
        size="md"
        variant="gradient"
      />
      <SectionContainer size="lg" className="pt-0 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {producers?.map((producer: any) => {
            const hasValidSlug =
              typeof producer.slug === 'string' && producer.slug.trim().length > 0
            const images = Array.isArray(producer.images)
              ? producer.images.filter((image: any): image is string => typeof image === 'string')
              : []

            const content = (
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={images[0] || getRandomProducerImage(producer.name_default?.length || 0)}
                    alt={producer.name_default || t('default_name')}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{producer.name_default}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {[producer.address_city, producer.address_country_code]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {producer.type}
                    </Badge>
                  </div>

                  <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
                    {producer.description_default || t('no_description')}
                  </p>

                  <div className="flex items-center text-primary font-medium text-sm">
                    {hasValidSlug ? t('discover') : t('details_coming_soon')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            )

            if (!hasValidSlug) {
              return (
                <div key={producer.id} className="cursor-not-allowed opacity-80">
                  {content}
                </div>
              )
            }

            return (
              <Link key={producer.id} href={`/producers/${producer.slug}`}>
                {content}
              </Link>
            )
          })}
        </div>

        {(!producers || producers.length === 0) && (
          <div className="py-20 text-center">
            <Tractor className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">{t('no_producers')}</h3>
            <p className="text-muted-foreground">{t('no_producers_desc')}</p>
          </div>
        )}
      </SectionContainer>
    </>
  )
}
