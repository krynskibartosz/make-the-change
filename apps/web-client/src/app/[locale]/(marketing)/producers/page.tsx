import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, MapPin, Tractor } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

type ProducerRow = {
  id: string
  slug: string | null
  name_default: string | null
  images: unknown
  address_city: string | null
  address_country_code: string | null
  type: string | null
  description_default: string | null
}

const toProducerRow = (value: unknown): ProducerRow | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    slug: asString(value.slug) || null,
    name_default: asString(value.name_default) || null,
    images: value.images,
    address_city: asString(value.address_city) || null,
    address_country_code: asString(value.address_country_code) || null,
    type: asString(value.type) || null,
    description_default: asString(value.description_default) || null,
  }
}

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

  const { data } = await supabase.from('public_producers').select('*').order('name_default')
  const producers = Array.isArray(data)
    ? data
        .map((entry) => toProducerRow(entry))
        .filter((entry): entry is ProducerRow => entry !== null)
    : []

  return (
    <section className="pb-12 pt-0 md:pb-16 md:pt-2">
      {/* Page Hero Section */}
      <div className="py-8 md:pb-12 md:pt-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t('intro_title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('intro_description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pb-24 pt-8 lg:pb-16 lg:pt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {producers.map((producer) => {
            const hasValidSlug =
              typeof producer.slug === 'string' && producer.slug.trim().length > 0
            const images = Array.isArray(producer.images)
              ? producer.images.filter((image): image is string => typeof image === 'string')
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

        {producers.length === 0 && (
          <div className="py-20 text-center col-span-full">
            <Tractor className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">{t('no_producers')}</h3>
            <p className="text-muted-foreground">{t('no_producers_desc')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
