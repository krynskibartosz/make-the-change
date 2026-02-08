import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Tractor,
  Twitter,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { ProducerCapacity } from '@make-the-change/core'
import { getTranslations } from 'next-intl/server'

interface ProducerPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProducerPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: producer } = await supabase
    .from('public_producers')
    .select('name_default, description_default')
    .eq('slug', slug)
    .single()

  if (!producer) {
    return {
      title: 'Producteur non trouvé',
    }
  }

  return {
    title: producer.name_default,
    description: producer.description_default,
  }
}

export default async function ProducerPage({ params }: ProducerPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const t = await getTranslations('producers')

  const { data: producer } = await supabase
    .from('public_producers')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!producer) {
    notFound()
  }

  const socials = producer.social_media as Record<string, string> | null
  const capacity = producer.capacity_info as ProducerCapacity | null
  const images = (producer.images as string[]) || []
  const coverImage = images[0] || getRandomProducerImage(producer.name_default?.length || 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden bg-muted lg:h-[50vh]">
        <img
          src={coverImage}
          alt={producer.name_default || 'Producteur'}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
           <Link href="/producers">
            <Button variant="secondary" size="sm" className="backdrop-blur-md bg-background/50 hover:bg-background/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back_to_producers')}
            </Button>
           </Link>
        </div>

        <div className="container relative mx-auto h-full px-4">
          <div className="flex h-full flex-col justify-end pb-8">
            <Badge className="mb-4 w-fit capitalize" size="lg">
              {producer.type}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {producer.name_default}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>
                {[producer.address_city, producer.address_country_code].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 grid gap-8 px-4 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold">{t('about')}</h2>
            <div className="prose max-w-none text-muted-foreground dark:prose-invert">
              <p>{producer.description_default}</p>
              {producer.story_default && (
                <div className="mt-4 border-l-4 border-primary pl-4 italic">
                  {producer.story_default}
                </div>
              )}
            </div>
          </section>

          {/* Gallery */}
          {images.length > 1 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">{t('gallery')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={img}
                      alt={`${producer.name_default} - ${i + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {producer.certifications && producer.certifications.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">{t('certifications')}</h2>
              <div className="flex flex-wrap gap-2">
                {producer.certifications.map((cert: string) => (
                  <Badge key={cert} variant="outline" className="px-3 py-1 text-base">
                    {cert}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link href={`/producers/${producer.slug}/contact`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('contact')}
                </Link>
              </Button>
              {producer.contact_website && (
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={producer.contact_website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t('visit_website')}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Key Figures (Capacity Info) */}
          {capacity && (
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-primary" />
                  {t('key_figures')}
                </h3>
                <dl className="space-y-4">
                  {capacity.annual_production && (
                    <div>
                      <dt className="text-sm text-muted-foreground">{t('annual_production')}</dt>
                      <dd className="text-lg font-medium">
                        {capacity.annual_production.toLocaleString()} {capacity.unit}
                      </dd>
                    </div>
                  )}
                  {capacity.surface_area_hectares && (
                    <div>
                      <dt className="text-sm text-muted-foreground">{t('surface')}</dt>
                      <dd className="text-lg font-medium">{capacity.surface_area_hectares} ha</dd>
                    </div>
                  )}
                  {capacity.employees_count && (
                    <div>
                      <dt className="text-sm text-muted-foreground">{t('employees')}</dt>
                      <dd className="text-lg font-medium">{capacity.employees_count}</dd>
                    </div>
                  )}
                  {capacity.established_year && (
                    <div>
                      <dt className="text-sm text-muted-foreground">{t('since')}</dt>
                      <dd className="text-lg font-medium">{capacity.established_year}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Socials */}
          {socials && Object.keys(socials).length > 0 && (
            <div className="flex justify-center gap-4">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#1877F2]"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#E4405F]"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#0A66C2]"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#1DA1F2]"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
