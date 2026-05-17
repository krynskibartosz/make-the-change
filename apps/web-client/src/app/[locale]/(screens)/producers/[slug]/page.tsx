import { ExternalLink, Leaf, MapPin, TreePine, Waves } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'
import { formatCompact } from '@/lib/formatters'
import { resolveLocationDisplay } from '@/lib/location'
import { CurrencyAmount } from '@/components/currency'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import {
  getMockProducerBySlug,
  type MockProducerListProduct,
  type MockProducerListProject,
  type MockProducerSpeciesCard,
} from '@/app/[locale]/(site)/producers/_features/mock-producers'

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
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
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
    current_funding: typeof value.current_funding === 'number' ? value.current_funding : null,
    address_city: asString(value.address_city) || null,
    address_country_code: asString(value.address_country_code) || null,
  }
}

// ── Impact écologique calculé depuis le financement (cohérent avec projects-client.tsx) ──
const BEES_PER_EUR = 50000 / 1300
const OLIVE_PRICE_EUR = 150
const CORAL_PRICE_EUR = 30

type ImpactKind = 'beehive' | 'orchard' | 'reef'

function getProjectImpact(project: { current_funding: number | null; type: string | null }) {
  const funding = project.current_funding ?? 0
  const type = project.type
  if (type === 'orchard' || type === 'olive_tree') {
    return { value: Math.round(funding / OLIVE_PRICE_EUR), label: 'oliviers soutenus', kind: 'orchard' as ImpactKind }
  }
  if (type === 'reef' || type === 'coral') {
    return { value: Math.round(funding / CORAL_PRICE_EUR), label: 'coraux plantés', kind: 'reef' as ImpactKind }
  }
  if (type === 'beehive') {
    return { value: Math.round(funding * BEES_PER_EUR), label: 'abeilles soutenues', kind: 'beehive' as ImpactKind }
  }
  return null
}

type ProducerProject = {
  id: string
  slug: string | null
  name_default: string | null
  hero_image_url: string | null
  type: string | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
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
    contact_website: string | null
  }
  products: MockProducerListProduct[] | ProductRow[]
  projects: ProducerProject[]
  species: MockProducerSpeciesCard[]
  showFollowButton: boolean
  isFollowingProducer?: boolean
}

function ProducerDetailView({
  producer,
  products,
  projects,
  species,
}: ProducerDetailViewProps) {
  const location = [producer.address_city, producer.address_country_code].filter(Boolean).join(', ')
  const coverImage = producer.images[0] || getRandomProducerImage(producer.name_default.length || 0)
  const logoImage = producer.images[1] || producer.images[0] || coverImage

  // ── Agrégation impact écologique par type ──
  const impactStats: { value: number; label: string; kind: ImpactKind }[] = []
  const beesTotal = projects.reduce((sum, p) => {
    if (p.type === 'beehive') return sum + Math.round((p.current_funding ?? 0) * BEES_PER_EUR)
    return sum
  }, 0)
  const oliviersTotal = projects.reduce((sum, p) => {
    if (p.type === 'orchard' || p.type === 'olive_tree') return sum + Math.round((p.current_funding ?? 0) / OLIVE_PRICE_EUR)
    return sum
  }, 0)
  const corauxTotal = projects.reduce((sum, p) => {
    if (p.type === 'reef' || p.type === 'coral') return sum + Math.round((p.current_funding ?? 0) / CORAL_PRICE_EUR)
    return sum
  }, 0)
  if (beesTotal > 0) impactStats.push({ value: beesTotal, label: 'abeilles soutenues', kind: 'beehive' })
  if (oliviersTotal > 0) impactStats.push({ value: oliviersTotal, label: 'oliviers soutenus', kind: 'orchard' })
  if (corauxTotal > 0) impactStats.push({ value: corauxTotal, label: 'coraux plantés', kind: 'reef' })

  return (
    <div className="bg-[#0B0F15] text-white">
      {/* ── Hero cover ── */}
      <div className="relative h-56 w-full overflow-hidden bg-[#1A1F26]">
        <img src={coverImage} alt={producer.name_default} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/35 to-transparent" />
      </div>

      {/* ── Identity header ── */}
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
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {location}
              </p>
            ) : null}
            {producer.type ? (
              <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                {producer.type}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Impact écologique agrégé ── */}
      {impactStats.length > 0 ? (
        <ul aria-label="Impact collectif du partenaire" className="mt-8 flex flex-wrap gap-3 px-5 m-0 p-0 list-none">
          {impactStats.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-start rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <span className={`text-2xl font-black tabular-nums leading-none ${
                stat.kind === 'beehive' ? 'text-amber-400' :
                stat.kind === 'orchard' ? 'text-emerald-400' :
                'text-sky-400'
              }`}>
                {formatCompact(stat.value)}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* ─────────────────────────────────────────────────────────────────────────
          ESPÈCES — design BioDexCard borderless, scroll horizontal
      ───────────────────────────────────────────────────────────────────────── */}
      {species.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 px-5 text-xl font-black tracking-tight text-white">
            Espèces à découvrir
          </h2>
          <ul
            aria-label="Espèces à découvrir"
            className="flex list-none snap-x gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0"
          >
            {species.map((entry) => (
              <li
                key={entry.id}
                className="relative block w-28 shrink-0 snap-center transition-transform duration-150 active:scale-[0.97]"
              >
                <article className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square relative flex items-center justify-center">
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="h-full w-full object-contain transition-all duration-700"
                    />
                  </div>
                  <p className="text-sm font-medium text-center leading-snug text-white/90 truncate w-full px-1">
                    {entry.name}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${entry.unlocked ? 'text-emerald-500/60' : 'text-white/30'}`}>
                    {entry.unlocked ? 'DÉCOUVERT' : 'À DÉCOUVRIR'}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────────────────────────────────
          PROJETS — même design que projects-client.tsx, scroll horizontal
          Image 4/3 rounded-3xl + titre + localisation + métrique d'impact
      ───────────────────────────────────────────────────────────────────────── */}
      {projects.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-5 px-5 text-xl font-black tracking-tight text-white">
            Explorez leurs projets
          </h2>
          <ul
            aria-label="Projets du partenaire"
            className="flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
          >
            {projects.map((project) => {
              const impact = getProjectImpact(project)
              const locationDisplay = project.address_country_code
                ? resolveLocationDisplay(project.address_country_code, project.address_city, 'fr')
                : null

              return (
                <li key={project.id} className="w-72 shrink-0 snap-start">
                  <Link
                    href={project.slug ? `/projects/${project.slug}` : '/projects'}
                    className="group block text-left active:scale-[0.98] transition-transform duration-200"
                  >
                    <article>
                      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-white/5">
                        {project.hero_image_url ? (
                          <img
                            src={project.hero_image_url}
                            alt={project.name_default || ''}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/10" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 px-1">
                        <h3 className="text-[20px] font-black text-white leading-[1.1] tracking-tight text-balance">
                          {project.name_default}
                        </h3>
                        {locationDisplay ? (
                          <div className="flex items-center gap-1.5 text-white/50 text-[13px] mt-0.5">
                            <span className="text-[15px] leading-none">{locationDisplay.flag}</span>
                            <span className="tracking-wide font-medium">{locationDisplay.label}</span>
                          </div>
                        ) : null}
                        {impact && impact.value > 0 ? (
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              impact.kind === 'beehive' ? 'bg-amber-400/15' :
                              impact.kind === 'orchard' ? 'bg-emerald-400/15' :
                              'bg-sky-400/15'
                            }`}>
                              {impact.kind === 'orchard' ? (
                                <TreePine className="w-3 h-3 text-emerald-300" />
                              ) : impact.kind === 'reef' ? (
                                <Waves className="w-3 h-3 text-sky-300" />
                              ) : (
                                <Leaf className="w-3 h-3 text-amber-300" />
                              )}
                            </div>
                            <p className="text-[13px]">
                              <span className="text-white/90 font-black tabular-nums tracking-tight">
                                {formatCompact(impact.value)}
                              </span>{' '}
                              <span className="text-white/70 font-medium">{impact.label}</span>
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────────────────────────────────
          PRODUITS — même design qu'AdvantageCard dans advantages-tab.tsx
          Image 4/5, rounded-2xl, partenaire + titre + CurrencyAmount
      ───────────────────────────────────────────────────────────────────────── */}
      {products.length > 0 ? (
        <section className="mt-10 px-5">
          <h2 className="mb-5 text-xl font-black tracking-tight text-white">Leurs produits</h2>
          <ul
            aria-label="Produits du partenaire"
            className="grid grid-cols-2 gap-x-4 gap-y-6 m-0 p-0 list-none"
          >
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={product.slug ? `/products/${product.slug}` : '/products'}
                  className="group flex flex-col gap-2 transition-transform active:scale-[0.98]"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name_default || ''}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Leaf className="h-8 w-8 text-white/20" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-0.5">
                    <span className="text-xs uppercase tracking-wider text-zinc-400">
                      {producer.name_default}
                    </span>
                    <h4 className="line-clamp-2 text-sm font-semibold text-white">
                      {product.name_default}
                    </h4>
                    {typeof product.price_points === 'number' && product.price_points > 0 ? (
                      <div className="mt-1">
                        <CurrencyAmount kind="impactCredits" value={product.price_points} className="text-sm font-bold" />
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Description du partenaire ── */}
      <section className="mt-10 px-5">
        <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 m-0">
          L&apos;histoire du partenaire
        </h2>
        <p className="text-[15px] font-medium leading-relaxed text-white/70 text-pretty">
          {producer.description_default}
        </p>
      </section>

      {/* ── CTA site web ── */}
      {producer.contact_website ? (
        <div className="mt-12 border-t border-white/5 px-5 pb-12 pt-8">
          <a
            href={producer.contact_website}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 text-sm font-black text-white transition-all active:scale-95"
          >
            <ExternalLink className="h-4 w-4 text-white/50" aria-hidden="true" />
            Visiter leur site web
          </a>
        </div>
      ) : (
        <div className="pb-12" />
      )}
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
      <FullScreenSlideModal
        title={producer.name_default}
        fallbackHref="/producers"
        headerMode="dynamic"
        contentClassName="overflow-y-auto"
      >
        <ProducerDetailView
          producer={producer}
          projects={producer.projects}
          products={producer.products}
          species={producer.species}
          showFollowButton={false}
          isFollowingProducer={Boolean(viewer)}
        />
      </FullScreenSlideModal>
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

  const { data: productsRaw } = await supabase
    .from('public_products')
    .select('id, slug, name_default, image_url, price_points')
    .eq('producer_id', producer.id)
    .order('featured', { ascending: false })
    .limit(6)

  const { data: projectsRaw } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, hero_image_url, status, type, current_funding, address_city, address_country_code')
    .eq('producer_id', producer.id)
    .limit(4)

  const products = Array.isArray(productsRaw)
    ? productsRaw.map((entry) => toProductRow(entry)).filter((entry): entry is ProductRow => entry !== null)
    : []

  const projects = Array.isArray(projectsRaw)
    ? projectsRaw.map((entry) => toProjectRow(entry)).filter((entry): entry is ProjectRow => entry !== null)
    : []

  return (
    <FullScreenSlideModal
      title={producer.name_default}
      fallbackHref="/producers"
      headerMode="dynamic"
      contentClassName="overflow-y-auto"
    >
      <ProducerDetailView
        producer={{
          id: producer.id,
          name_default: producer.name_default,
          description_default: producer.description_default || t('no_description'),
          address_city: producer.address_city,
          address_country_code: producer.address_country_code,
          type: producer.type,
          images,
          contact_website: producer.contact_website,
        }}
        projects={projects}
        products={products}
        species={[]}
        showFollowButton={Boolean(viewer)}
        isFollowingProducer={isFollowingProducer}
      />
    </FullScreenSlideModal>
  )
}
