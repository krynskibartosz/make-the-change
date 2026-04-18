import {
  ArrowLeft,
  ExternalLink,
  Leaf,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Trees,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FollowToggleButton } from '@/components/social/follow-toggle-button'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'
import {
  getMockProducerBySlug,
  type MockProducerListProduct,
  type MockProducerListProject,
  type MockProducerSeed,
  type MockProducerSpeciesCard,
} from '../_features/mock-producers'

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
  price_points: number | null
}

type ProjectRow = {
  id: string
  slug: string | null
  name_default: string | null
  hero_image_url: string | null
  status: string | null
  type: string | null
}

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const toProducerRow = (value: unknown): ProducerRow | null => {
  if (!isRecord(value)) return null
  const id = asString(value.id)
  if (!id) return null

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
  if (!isRecord(value)) return null
  const id = asString(value.id)
  if (!id) return null

  return {
    id,
    slug: asString(value.slug) || null,
    name_default: asString(value.name_default) || null,
    image_url: asString(value.image_url) || null,
    price_points: typeof value.price_points === 'number' ? value.price_points : null,
  }
}

const toProjectRow = (value: unknown): ProjectRow | null => {
  if (!isRecord(value)) return null
  const id = asString(value.id)
  if (!id) return null

  return {
    id,
    slug: asString(value.slug) || null,
    name_default: asString(value.name_default) || null,
    hero_image_url: asString(value.hero_image_url) || null,
    status: asString(value.status) || null,
    type: asString(value.type) || null,
  }
}

const formatTypeLabel = (value: string | null | undefined): string => {
  if (!value) return 'Projet'
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return 'Projet'
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
}

type ProducerDetailViewProps = {
  producer: {
    id: string
    name_default: string
    description_default: string
    address_city: string | null
    address_country_code: string | null
    type: string | null
    images: string[]
    certifications: string[]
    contact_website: string | null
  }
  products: MockProducerListProduct[] | ProductRow[]
  projects: MockProducerListProject[] | ProjectRow[]
  species: MockProducerSpeciesCard[]
  showFollowButton: boolean
  isFollowingProducer?: boolean
}

function ProducerDetailView({
  producer,
  products,
  projects,
  species,
  showFollowButton,
  isFollowingProducer = false,
}: ProducerDetailViewProps) {
  const location = [producer.address_city, producer.address_country_code].filter(Boolean).join(', ')
  const coverImage = producer.images[0] || getRandomProducerImage(producer.name_default.length || 0)
  const logoImage = producer.images[1] || producer.images[0] || coverImage

  return (
    <div className="min-h-screen bg-[#0B0F15] pb-32 text-white">
      <div className="relative h-56 w-full overflow-hidden bg-[#1A1F26]">
        <img src={coverImage} alt={producer.name_default} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/35 to-transparent" />
        <div className="absolute left-4 right-4 top-14 z-10 flex justify-between pt-[env(safe-area-inset-top)]">
          <Link
            href="/producers"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          {producer.contact_website ? (
            <a
              href={producer.contact_website}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all active:scale-90"
            >
              <ExternalLink className="h-5 w-5 text-white" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative px-5">
        <div className="absolute -top-12 left-5 z-10 h-24 w-24 rounded-[2rem] border-[4px] border-[#0B0F15] bg-[#0B0F15] p-1.5 shadow-2xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/5">
            <img src={logoImage} alt={producer.name_default} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="h-16" />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-none tracking-tighter text-white">
              {producer.name_default}
            </h1>
            {location ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white/40">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {location}
              </p>
            ) : null}
            {producer.type ? (
              <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                {producer.type}
              </p>
            ) : null}
          </div>
          <div className="shrink-0">
            {showFollowButton ? (
              <FollowToggleButton
                targetType="producer"
                targetId={producer.id}
                initialFollowing={isFollowingProducer}
                className="h-auto rounded-2xl border-0 bg-lime-400 px-6 py-2.5 text-sm font-bold text-[#0B0F15] hover:bg-lime-300"
              />
            ) : (
              <div className="rounded-2xl border border-lime-400/20 bg-lime-400/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-lime-300">
                Partenaire en vedette
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 px-5">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
          <Trees className="mb-2 h-5 w-5 text-emerald-400" />
          <div className="text-2xl font-black leading-none text-white">{projects.length}</div>
          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
            PROJETS
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
          <Leaf className="mb-2 h-5 w-5 text-lime-400" />
          <div className="text-2xl font-black leading-none text-white">{species.length}</div>
          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
            ESPECES
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
          <Package className="mb-2 h-5 w-5 text-sky-400" />
          <div className="text-2xl font-black leading-none text-white">{products.length}</div>
          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
            PRODUITS
          </div>
        </div>
      </div>

      {species.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 px-5 text-xl font-bold tracking-tight">Especes a decouvrir</h2>
          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {species.map((entry) => (
              <div
                key={entry.id}
                className="group relative flex aspect-[4/5] w-40 shrink-0 snap-center flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 p-3 transition-all active:scale-[0.98]"
              >
                <div className="mb-2 flex justify-end">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/20 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 text-lime-400" />
                  </div>
                </div>
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/5">
                  <img
                    src={entry.image}
                    alt={entry.name}
                    className="h-full w-full scale-105 object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="mt-2.5 px-1">
                  <p className="truncate text-sm font-bold leading-tight text-white">{entry.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section className="mt-10 w-full max-w-full overflow-hidden">
          <h3 className="mb-4 px-5 text-xl font-bold tracking-tight text-white">
            Explorez leurs projets
          </h3>

          <div className="ml-5 flex gap-4 overflow-x-auto overflow-y-hidden pb-4 pr-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.slug ? `/projects/${project.slug}` : '/projects'}
                className="group relative h-[160px] min-w-[240px] w-[240px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all active:scale-95"
              >
                {project.hero_image_url ? (
                  <img
                    src={project.hero_image_url}
                    alt={project.name_default || ''}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                    <Leaf className="h-8 w-8 text-white/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-lime-400">
                    {formatTypeLabel(project.type)}
                  </span>
                  <h4 className="truncate text-sm font-black leading-tight text-white">
                    {project.name_default}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {products.length > 0 ? (
        <section className="mt-10">
          <h3 className="mb-4 px-5 text-xl font-bold tracking-tight text-white">Leurs produits</h3>
          <div className="ml-5 flex gap-4 overflow-x-auto pb-4 pr-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.slug ? `/products/${product.slug}` : '/products'}
                className="group min-w-[150px] w-[150px] shrink-0 rounded-[2rem] border border-white/5 bg-[#1A1F26] p-3 shadow-xl transition-all active:scale-95"
              >
                <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/5">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name_default || ''}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <Leaf className="h-8 w-8 text-white/40" />
                  )}
                </div>
                <h4 className="mb-2 line-clamp-2 text-xs font-black leading-tight text-white">
                  {product.name_default}
                </h4>
                {typeof product.price_points === 'number' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tighter text-lime-400">
                      {product.price_points.toLocaleString('fr-FR')}
                    </span>
                    <Sparkles className="h-3 w-3 text-lime-400" />
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 px-5">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          L'histoire du partenaire
        </p>
        <p className="text-[15px] font-medium leading-relaxed text-white/70 text-pretty">
          {producer.description_default}
        </p>
      </div>

      {producer.certifications.length > 0 ? (
        <div className="mt-8 px-5">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Certifications & labels
          </p>
          <div className="flex flex-wrap gap-2.5">
            {producer.certifications.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white/60"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-lime-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {producer.contact_website ? (
        <div className="mt-12 border-t border-white/5 px-5 pb-12 pt-8">
          <a
            href={producer.contact_website}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 text-sm font-black text-white transition-all active:scale-95"
          >
            <ExternalLink className="h-4 w-4 text-white/50" />
            Visiter leur site web
          </a>
        </div>
      ) : null}
    </div>
  )
}

export default async function ProducerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (isMockDataSource) {
    const producer = getMockProducerBySlug(slug)
    if (!producer) {
      notFound()
    }

    const viewer = await getCurrentViewer()

    return (
      <ProducerDetailView
        producer={producer}
        projects={producer.projects}
        products={producer.products}
        species={producer.species}
        showFollowButton={false}
        isFollowingProducer={Boolean(viewer)}
      />
    )
  }

  const supabase = await createClient()
  const t = await getTranslations('producers')
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser()

  const { data: producerRaw, error: producerError } = await supabase
    .from('public_producers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (producerError || !producerRaw) {
    notFound()
  }

  const producer = toProducerRow(producerRaw)
  if (!producer || !producer.name_default || !producer.description_default) {
    notFound()
  }

  let isFollowingProducer = false
  if (viewer) {
    const { data: existingFollow } = await supabase
      .schema('social')
      .from('follows')
      .select('id')
      .eq('follower_id', viewer.id)
      .eq('producer_id', producer.id)
      .maybeSingle()
    isFollowingProducer = !!existingFollow?.id
  }

  const images = normalizeStringArray(producer.images)
  const certifications = normalizeStringArray(producer.certifications)

  const { data: productsRaw } = await supabase
    .from('public_products')
    .select('id, slug, name_default, image_url, price_points')
    .eq('producer_id', producer.id)
    .order('featured', { ascending: false })
    .limit(6)

  const { data: projectsRaw } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, hero_image_url, status, type')
    .eq('producer_id', producer.id)
    .limit(4)

  const products = Array.isArray(productsRaw)
    ? productsRaw.map((entry) => toProductRow(entry)).filter((entry): entry is ProductRow => entry !== null)
    : []

  const projects = Array.isArray(projectsRaw)
    ? projectsRaw.map((entry) => toProjectRow(entry)).filter((entry): entry is ProjectRow => entry !== null)
    : []

  return (
    <ProducerDetailView
      producer={{
        id: producer.id,
        name_default: producer.name_default,
        description_default: producer.description_default || t('no_description'),
        address_city: producer.address_city,
        address_country_code: producer.address_country_code,
        type: producer.type,
        images,
        certifications,
        contact_website: producer.contact_website,
      }}
      projects={projects}
      products={products}
      species={[]}
      showFollowButton={Boolean(viewer)}
      isFollowingProducer={isFollowingProducer}
    />
  )
}
