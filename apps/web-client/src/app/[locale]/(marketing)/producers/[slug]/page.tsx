import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Factory,
  Leaf,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

type ProducerRow = {
  id: string
  slug: string | null
  name_default: string | null
  description_default: string | null
  address_city: string | null
  address_country_code: string | null
  type: string | null
  images: unknown
  certifications: unknown
  contact_website: string | null
}

type ProductRow = {
  id: string
  slug: string | null
  name_default: string | null
  image_url: string | null
}

type ProjectRow = {
  id: string
  slug: string | null
  name_default: string | null
  hero_image_url: string | null
  status: string | null
}

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

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
    description_default: asString(value.description_default) || null,
    address_city: asString(value.address_city) || null,
    address_country_code: asString(value.address_country_code) || null,
    type: asString(value.type) || null,
    images: value.images,
    certifications: value.certifications,
    contact_website: asString(value.contact_website) || null,
  }
}

const toProductRow = (value: unknown): ProductRow | null => {
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
    image_url: asString(value.image_url) || null,
  }
}

const toProjectRow = (value: unknown): ProjectRow | null => {
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
    hero_image_url: asString(value.hero_image_url) || null,
    status: asString(value.status) || null,
  }
}

export default async function ProducerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const t = await getTranslations('producers')

  const { data: producerRaw, error: producerError } = await supabase
    .from('public_producers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (producerError || !producerRaw) {
    notFound()
  }

  const producer = toProducerRow(producerRaw)
  if (!producer) {
    notFound()
  }

  const location = [producer.address_city, producer.address_country_code].filter(Boolean).join(', ')
  const images = normalizeStringArray(producer.images)
  const certifications = normalizeStringArray(producer.certifications)
  const coverImage = images[0] || getRandomProducerImage(producer.name_default?.length || 0)

  const [{ data: productsRaw }, { data: projectsRaw }] = await Promise.all([
    supabase
      .from('public_products')
      .select('id, slug, name_default, image_url')
      .eq('producer_id', producer.id)
      .eq('active', true)
      .limit(6),
    supabase
      .from('public_projects')
      .select('id, slug, name_default, hero_image_url, status')
      .eq('producer_id', producer.id)
      .limit(6),
  ])

  const products = Array.isArray(productsRaw)
    ? productsRaw
        .map((entry) => toProductRow(entry))
        .filter((entry): entry is ProductRow => entry !== null)
    : []
  const projects = Array.isArray(projectsRaw)
    ? projectsRaw
        .map((entry) => toProjectRow(entry))
        .filter((entry): entry is ProjectRow => entry !== null)
    : []

  return (
    <>
      <PageHero
        title={producer.name_default || t('default_name')}
        description={producer.description_default || t('no_description')}
        badge={producer.type || t('producer_label')}
        variant="gradient"
        size="md"
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {location ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1">
            <Factory className="h-4 w-4" />
            {t('producer_label')}
          </span>
        </div>
      </PageHero>

      <SectionContainer size="lg" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={coverImage}
                alt={producer.name_default || t('default_name')}
                className="h-[280px] w-full object-cover md:h-[380px]"
              />
            </div>

            <Card>
              <CardContent className="space-y-4 p-6 md:p-8">
                <h2 className="text-2xl font-black tracking-tight">{t('about')}</h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {producer.description_default || t('no_description')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6 md:p-8">
                <h2 className="text-2xl font-black tracking-tight">{t('certifications')}</h2>
                {certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('no_certifications')}</p>
                )}
              </CardContent>
            </Card>

            {products.length > 0 ? (
              <Card>
                <CardContent className="space-y-4 p-6 md:p-8">
                  <h2 className="text-2xl font-black tracking-tight">{t('related_products')}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={product.slug ? `/products/${product.slug}` : '/products'}
                        className="group overflow-hidden rounded-2xl border border-border bg-background transition hover:border-primary/40"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name_default || t('default_product_name')}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <Leaf className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <span className="font-semibold">
                            {product.name_default || t('default_product_name')}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-black tracking-tight">{t('key_figures')}</h2>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t('related_products')}
                    </p>
                    <p className="mt-1 text-2xl font-black">{products.length}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t('related_projects')}
                    </p>
                    <p className="mt-1 text-2xl font-black">{projects.length}</p>
                  </div>
                  {location ? (
                    <div className="rounded-2xl border border-border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t('location')}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{location}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {projects.length > 0 ? (
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-lg font-black tracking-tight">{t('related_projects')}</h2>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={project.slug ? `/projects/${project.slug}` : '/projects'}
                        className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition hover:border-primary/40"
                      >
                        <div>
                          <p className="font-semibold">
                            {project.name_default || t('default_project_name')}
                          </p>
                          {project.status ? (
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              {project.status}
                            </p>
                          ) : null}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardContent className="space-y-3 p-6">
                <h2 className="inline-flex items-center gap-2 text-lg font-black tracking-tight">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  {t('contact')}
                </h2>
                {producer.contact_website ? (
                  <Button asChild className="w-full justify-center">
                    <a href={producer.contact_website} target="_blank" rel="noreferrer">
                      {t('visit_website')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('no_contact_available')}</p>
                )}

                <Button variant="outline" asChild className="w-full justify-center">
                  <Link href="/producers">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('back_to_producers')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
