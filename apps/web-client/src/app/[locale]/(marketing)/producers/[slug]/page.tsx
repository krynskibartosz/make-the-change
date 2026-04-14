import {
  ArrowLeft,
  Bug,
  ExternalLink,
  Hexagon,
  MapPin,
  Package,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FollowToggleButton } from '@/components/social/follow-toggle-button'
import { Link } from '@/i18n/navigation'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'
import { asString, asNumber, isRecord } from '@/lib/type-guards'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  current_funding: number | null
  target_budget: number | null
}

// ─── Simulated BioDex Species (pour ce partenaire) ───────────────────────────

const MOCK_SPECIES = [
  {
    id: 'sp-1',
    name: "Abeille Noire",
    scientific_name: "Apis mellifera mellifera",
    status: 'EN',
    statusLabel: 'EN DANGER',
    statusColor: 'text-orange-400',
    statusBg: 'bg-orange-400/15',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    unlocked: true,
  },
  {
    id: 'sp-2',
    name: "Bourdon Terrestre",
    scientific_name: "Bombus terrestris",
    status: 'VU',
    statusLabel: 'VULNÉRABLE',
    statusColor: 'text-yellow-400',
    statusBg: 'bg-yellow-400/15',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=400&q=80',
    unlocked: false,
  },
  {
    id: 'sp-3',
    name: "Papillon Machaon",
    scientific_name: "Papilio machaon",
    status: 'NT',
    statusLabel: 'QUASI MENACÉ',
    statusColor: 'text-lime-400',
    statusBg: 'bg-lime-400/15',
    image_url: 'https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=400&q=80',
    unlocked: false,
  },
]

// ─── Parsers ─────────────────────────────────────────────────────────────────

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
    current_funding: typeof value.current_funding === 'number' ? value.current_funding : null,
    target_budget: typeof value.target_budget === 'number' ? value.target_budget : null,
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProducerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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
  if (!producer) {
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

  const location = [producer.address_city, producer.address_country_code].filter(Boolean).join(', ')
  const images = normalizeStringArray(producer.images)
  const certifications = normalizeStringArray(producer.certifications)
  const coverImage = images[0] || getRandomProducerImage(producer.name_default?.length || 0)

  const [{ data: productsRaw }, { data: projectsRaw }] = await Promise.all([
    supabase
      .from('public_products')
      .select('id, slug, name_default, image_url, price_points')
      .eq('producer_id', producer.id)
      .eq('active', true)
      .limit(8),
    supabase
      .from('public_projects')
      .select('id, slug, name_default, hero_image_url, status, current_funding, target_budget')
      .eq('producer_id', producer.id)
      .limit(8),
  ])

  const products = Array.isArray(productsRaw)
    ? productsRaw.map(toProductRow).filter((e): e is ProductRow => e !== null)
    : []
  const projects = Array.isArray(projectsRaw)
    ? projectsRaw.map(toProjectRow).filter((e): e is ProjectRow => e !== null)
    : []

  // Simulated impact stats (à connecter à l'API réelle plus tard)
  const impactStats = {
    bees: '290k',
    honey: '58kg',
  }

  return (
    <div className="bg-[#0B0F15] min-h-screen pb-32">

      {/* ── 1. HEADER : Cover + Boutons nav ── */}
      <div className="relative w-full h-52 bg-[#1A1F26]">
        <img
          src={coverImage}
          alt={producer.name_default || t('default_name')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/30 to-transparent" />
        <div className="absolute top-14 left-4 right-4 flex justify-between z-10">
          <Link
            href="/producers"
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          {producer.contact_website && (
            <a
              href={producer.contact_website}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      {/* ── IDENTITÉ & CTA ── */}
      <div className="px-5 relative">
        {/* Avatar logo — object-contain pour un vrai logo */}
        <div className="absolute -top-12 left-5 w-24 h-24 rounded-2xl bg-[#0B0F15] p-1.5 border-[3px] border-[#0B0F15] z-10 shadow-xl">
          <div className="w-full h-full rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
            <img
              src={images[1] || images[0] || coverImage}
              alt={`Logo ${producer.name_default || t('default_name')}`}
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>
        <div className="h-14" />
        <div className="flex justify-between items-start mt-2">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {producer.name_default || t('default_name')}
            </h1>
            {location && (
              <p className="text-white/50 text-sm flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" /> {location}
              </p>
            )}
          </div>
          <div className="-mt-1">
            <FollowToggleButton
              targetType="producer"
              targetId={producer.id}
              initialFollowing={isFollowingProducer}
              className="bg-lime-400 text-[#0B0F15] hover:bg-lime-500 hover:text-[#0B0F15] px-5 py-2 h-auto rounded-full font-bold text-sm border-0 active:scale-95 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* ── 2. GLOBAL IMPACT DASHBOARD ── */}
      <div className="px-5 mt-6">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Impact Global Généré</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1A1F26] border border-white/5 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <span className="text-2xl font-black text-white tabular-nums">
              {projects.length > 0 ? projects.length : '—'}
            </span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-1">Projets</span>
          </div>
          <div className="bg-[#1A1F26] border border-lime-400/15 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <Bug className="w-4 h-4 text-lime-400 mb-1" />
            <span className="text-base font-black text-white tabular-nums">{impactStats.bees}</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Abeilles</span>
          </div>
          <div className="bg-[#1A1F26] border border-amber-500/15 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <Hexagon className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-base font-black text-white tabular-nums">{impactStats.honey}</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Miel</span>
          </div>
        </div>
      </div>

      {/* ── 3. BIODEX : Espèces Protégées ── */}
      <div className="mt-8">
        <div className="flex justify-between items-end px-5 mb-3">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Espèces protégées</p>
          <Link href="/biodex" className="text-[11px] font-bold text-lime-400">Voir le BioDex</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pl-5 pr-5 pb-2 scrollbar-hide">
          {MOCK_SPECIES.map((species) => (
            <Link
              key={species.id}
              href={`/biodex/${species.id}`}
              className="relative min-w-[130px] h-[170px] rounded-2xl overflow-hidden shrink-0 active:scale-95 transition-transform block"
            >
              {/* Image avec overlay de grisé si non-débloqué */}
              <img
                src={species.image_url}
                alt={species.name}
                className={`w-full h-full object-cover transition-all duration-300 ${!species.unlocked ? 'grayscale brightness-50' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Badge statut */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${species.statusBg} ${species.statusColor}`}>
                  {species.statusLabel}
                </span>
              </div>

              {/* Lock icon si non-débloqué */}
              {!species.unlocked && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <ShieldAlert className="w-3 h-3 text-white/60" />
                </div>
              )}

              {/* Nom en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm leading-tight">{species.name}</p>
                <p className="text-white/50 text-[10px] italic mt-0.5 truncate">{species.scientific_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. PROJETS : Carrousel horizontal avec progress bar ── */}
      {projects.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-end px-5 mb-3">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              Soutenir leurs projets ({projects.length})
            </p>
            <Link href="/projects" className="text-[11px] font-bold text-lime-400">Voir tout</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pl-5 pr-5 pb-2 scrollbar-hide snap-x snap-mandatory">
            {projects.map((project) => {
              const funding = project.current_funding ?? 0
              const budget = project.target_budget ?? 1
              const progress = budget > 0 ? Math.min(Math.round((funding / budget) * 100), 100) : 0
              const isActive = project.status === 'active' || !project.status
              return (
                <Link
                  key={project.id}
                  href={project.slug ? `/projects/${project.slug}` : '/projects'}
                  className="min-w-[260px] bg-[#1A1F26] border border-white/5 rounded-2xl overflow-hidden shrink-0 snap-start active:scale-[0.98] transition-transform block"
                >
                  {/* Image */}
                  <div className="relative w-full h-36 bg-white/5">
                    {project.hero_image_url ? (
                      <img src={project.hero_image_url} alt={project.name_default || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-lime-400/5 flex items-center justify-center">
                        <Bug className="w-10 h-10 text-lime-400/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F26] to-transparent" />
                    {/* Statut pill */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isActive ? 'bg-lime-400/20 text-lime-400' : 'bg-white/10 text-white/50'}`}>
                        {isActive ? '🟢 Actif' : project.status || 'Actif'}
                      </span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="p-4">
                    <p className="text-white font-bold text-sm leading-tight truncate mb-3">
                      {project.name_default || t('default_project_name')}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-1.5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Financé</span>
                      <span className="text-[10px] font-black text-lime-400 tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 5. VITRINE PRODUITS : Carrousel horizontal ── */}
      {products.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-end px-5 mb-3">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Leurs Récompenses</p>
            <Link href="/products" className="text-[11px] font-bold text-lime-400">Voir tout</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pl-5 pr-5 pb-2 scrollbar-hide">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.slug ? `/products/${product.slug}` : '/products'}
                className="min-w-[130px] bg-[#1A1F26] border border-white/5 rounded-2xl p-2.5 shrink-0 active:scale-95 transition-transform block"
              >
                <div className="w-full aspect-square rounded-xl bg-white/5 mb-2.5 overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name_default || ''} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-white/20" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white truncate">{product.name_default || t('default_product_name')}</h4>
                {product.price_points && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-lime-400 font-black text-sm tabular-nums">{product.price_points.toLocaleString('fr-FR')}</span>
                    <Sparkles className="w-3 h-3 text-lime-400" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. À PROPOS & CERTIFICATIONS (tout en bas) ── */}
      {producer.description_default && (
        <div className="px-5 mt-8">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">{t('about')}</p>
          <p className="text-white/70 leading-relaxed text-[15px]">{producer.description_default}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="px-5 mt-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">{t('certifications')}</p>
          <div className="flex flex-wrap gap-2">
            {certifications.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {producer.contact_website && (
        <div className="px-5 mt-8 border-t border-white/10 pt-6">
          <a
            href={producer.contact_website}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-white/5 border border-white/10 text-white font-medium text-sm h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-white/50" />
            Visiter le site web
          </a>
        </div>
      )}

    </div>
  )
}
