import { createClient } from '@/lib/supabase/server'
import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, MapPin, Tractor } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'

export const metadata = {
  title: 'Nos Producteurs',
  description: 'Découvrez les producteurs engagés qui changent le monde.',
}

export default async function ProducersPage() {
  const supabase = await createClient()
  const t = await getTranslations('producers')

  const { data: producers } = await supabase
    .from('public_producers')
    .select('*')
    .order('name_default')

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('intro_title')}</h1>
          <p className="text-xl text-muted-foreground">{t('intro_description')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {producers?.map((producer) => (
            <Link key={producer.id} href={`/producers/${producer.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={
                      (producer.images as string[])?.[0] ||
                      getRandomProducerImage(producer.name_default?.length || 0)
                    }
                    alt={producer.name_default || 'Producteur'}
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
                    {producer.description_default || 'Aucune description disponible.'}
                  </p>

                  <div className="flex items-center text-primary font-medium text-sm">
                    {t('discover')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!producers || producers.length === 0) && (
          <div className="py-20 text-center">
            <Tractor className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">{t('no_producers')}</h3>
            <p className="text-muted-foreground">{t('no_producers_desc')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
