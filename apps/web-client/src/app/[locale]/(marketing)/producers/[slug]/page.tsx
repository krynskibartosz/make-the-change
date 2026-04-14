import {
  ArrowLeft,
  Bug,
  ExternalLink,
  Hexagon,
  Lock,
  MapPin,
  Package,
  ShieldAlert,
  Sparkles,
  Leaf,
  Trees,
  Wind,
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
  type: string | null
}

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

// ─── HARDCODED DATA ──────────────────────────────────────────────────────────

const HARDCODED_PRODUCTS: ProductRow[] = [
  {
    id: 'prod-1',
    slug: 'miel-eucalyptus-250g',
    name_default: "Miel d'Eucalyptus - 250g",
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    price_points: 950,
  },
  {
    id: 'prod-2',
    slug: 'miel-foret-500g',
    name_default: "Miel de Forêt - 500g",
    image_url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80',
    price_points: 1450,
  },
  {
    id: 'prod-3',
    slug: 'coffret-decouverte',
    name_default: "Coffret Découverte 3 Miels",
    image_url: 'https://images.unsplash.com/photo-1621262916295-e23432e36683?auto=format&fit=crop&w=400&q=80',
    price_points: 2200,
  },
  {
    id: 'prod-4',
    slug: 'bougie-cire-abeille',
    name_default: "Bougie Cire d'Abeille Artisanale",
    image_url: 'https://images.unsplash.com/photo-1602102127110-613d9061dfdb?auto=format&fit=crop&w=400&q=80',
    price_points: 600,
  },
]

const MOCK_SPECIES = [
  {
    id: 'sp-1',
    name: "Abeille Noire",
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    unlocked: true,
  },
  {
    id: 'sp-2',
    name: "Bourdon Terrestre",
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=400&q=80',
    unlocked: false,
  },
  {
    id: 'sp-3',
    name: "Papillon Machaon",
    image: 'https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=400&q=80',
    unlocked: false,
  },
  {
    id: 'sp-4',
    name: "Mante Religieuse",
    image: 'https://images.unsplash.com/photo-1576181256391-9c642730248a?auto=format&fit=crop&w=400&q=80',
    unlocked: false,
  },
]

const formatTypeLabel = (value: string | null | undefined): string => {
  if (!value) return 'Projet'
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return 'Projet'
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
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

  const { data: projectsRaw } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, hero_image_url, status, type')
    .eq('producer_id', producer.id)
    .limit(4)

  const projects = Array.isArray(projectsRaw) ? projectsRaw : []

  return (
    <div className="bg-[#0B0F15] min-h-screen pb-32 text-white">

      {/* ── 1. HEADER : Cover + Actions ── */}
      <div className="relative w-full h-52 bg-[#1A1F26]">
        <img
          src={coverImage}
          alt={producer.name_default || ''}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent" />
        <div className="absolute top-14 left-4 right-4 flex justify-between z-10 pt-[env(safe-area-inset-top)]">
          <Link
            href="/producers"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          {producer.contact_website && (
            <a
              href={producer.contact_website}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-all border border-white/10"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      {/* ── IDENTITÉ ── */}
      <div className="px-5 relative">
        <div className="absolute -top-12 left-5 w-24 h-24 rounded-[2rem] bg-[#0B0F15] p-1.5 border-[4px] border-[#0B0F15] z-10 shadow-2xl">
          <div className="w-full h-full rounded-[1.5rem] bg-white/5 flex items-center justify-center overflow-hidden">
            <img
              src={images[1] || images[0] || coverImage}
              alt="Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>
        <div className="h-16" />
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
              {producer.name_default || t('default_name')}
            </h1>
            {location && (
              <p className="text-white/40 text-sm flex items-center gap-1.5 mt-2 font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {location}
              </p>
            )}
          </div>
          <div className="shrink-0 -mt-1">
            <FollowToggleButton
              targetType="producer"
              targetId={producer.id}
              initialFollowing={isFollowingProducer}
              className="bg-lime-400 text-[#0B0F15] hover:bg-lime-300 font-bold px-6 py-2.5 h-auto rounded-2xl active:scale-95 transition-all text-sm border-0"
            />
          </div>
        </div>
      </div>

      {/* ── 2. IMPACT DASHBOARD (Bento Grid) ── */}
      <div className="px-5 mt-8 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center shrink-0">
            <div className="mb-2">
              <Trees className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black tabular-nums text-white leading-none">
              {projects.length}
            </div>
            <div className="mt-1.5 text-[10px] uppercase font-bold tracking-widest text-white/40">PROJETS</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center shrink-0">
            <div className="mb-2">
              <Bug className="w-5 h-5 text-lime-400" />
            </div>
            <div className="text-2xl font-black tabular-nums text-white leading-none">290k</div>
            <div className="mt-1.5 text-[10px] uppercase font-bold tracking-widest text-white/40">ABEILLES</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center shrink-0">
            <div className="mb-2">
              <Wind className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-2xl font-black tabular-nums text-white leading-none">12t</div>
            <div className="mt-1.5 text-[10px] uppercase font-bold tracking-widest text-white/40">CO₂ CAPTURÉ</div>
        </div>
      </div>

      {/* ── 3. BIODEX : ESPÈCES (Style Profil Utilisateur) ── */}
      <section className="mt-10">
        <h2 className="mb-4 px-5 text-xl font-bold tracking-tight">Débloquez leur BioDex</h2>

        <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
          {MOCK_SPECIES.map((species) => (
            <div
              key={species.id}
              className="relative flex aspect-[4/5] w-40 shrink-0 snap-center flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 p-3 group active:scale-[0.98] transition-all"
            >
              <div className="mb-2 flex justify-end shrink-0">
                {!species.unlocked ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-lg">
                    <Lock className="h-3.5 h-3.5 text-white/40" />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/20 shadow-lg border border-lime-400/20">
                    <Sparkles className="h-3.5 h-3.5 text-lime-400" />
                  </div>
                )}
              </div>
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/5 border border-white/5">
                <img
                  src={species.image}
                  alt={species.name}
                  className={`h-full w-full scale-105 object-cover transition-all duration-700 group-hover:scale-110 ${
                    !species.unlocked ? 'grayscale contrast-125 opacity-40 blur-[2px]' : ''
                  }`}
                />
              </div>
              <div className="mt-2.5 shrink-0 px-1">
                <p className={`truncate text-sm font-bold leading-tight ${!species.unlocked ? 'text-white/40' : 'text-white'}`}>
                  {species.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PROJETS (Style Page Détail Projet) ── */}
      {projects.length > 0 && (
        <section className="mt-10 w-full max-w-full overflow-hidden">
          <h3 className="mb-4 px-5 text-xl font-bold text-white tracking-tight">Explorez leurs projets</h3>

          <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden px-5 pb-4 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
            {projects.map((project) => {
              const typeLabel = formatTypeLabel(project.type)
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="min-w-[240px] w-[240px] h-[160px] shrink-0 snap-start rounded-[2rem] overflow-hidden relative group cursor-pointer border border-white/10 shadow-2xl active:scale-95 transition-all"
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
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-1.5 block">
                      {typeLabel}
                    </span>
                    <h4 className="text-sm font-black text-white leading-tight truncate">{project.name_default}</h4>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 5. VITRINE PRODUITS (Hardcoded pour assurer l'affichage) ── */}
      <section className="mt-10">
        <h3 className="mb-4 px-5 text-xl font-bold text-white tracking-tight">Leurs Récompenses</h3>
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide touch-pan-x snap-x">
          {HARDCODED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="min-w-[150px] w-[150px] bg-[#1A1F26] border border-white/5 rounded-[2rem] p-3 shrink-0 snap-start active:scale-95 transition-all shadow-xl group"
            >
              <div className="w-full aspect-square rounded-[1.5rem] bg-white/5 mb-3 overflow-hidden flex items-center justify-center">
                <img 
                  src={product.image_url!} 
                  alt={product.name_default!} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <h4 className="text-xs font-black text-white leading-tight mb-2 line-clamp-2">{product.name_default}</h4>
              {product.price_points && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lime-400 font-black text-sm tabular-nums tracking-tighter">
                    {product.price_points.toLocaleString('fr-FR')}
                  </span>
                  <Sparkles className="w-3 h-3 text-lime-400" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. À PROPOS ── */}
      {producer.description_default && (
        <div className="px-5 mt-10">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">L'histoire du partenaire</p>
          <p className="text-white/70 leading-relaxed text-[15px] font-medium text-pretty">
            {producer.description_default}
          </p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="px-5 mt-8">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Certifications & Labels</p>
          <div className="flex flex-wrap gap-2.5">
            {certifications.map((item) => (
              <span
                key={item}
                className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 border border-white/10 rounded-2xl"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Contact */}
      {producer.contact_website && (
        <div className="px-5 mt-12 pb-12 border-t border-white/5 pt-8">
          <a
            href={producer.contact_website}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-white/10 border border-white/10 text-white font-black text-sm h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-white/50" />
            Visiter leur site web
          </a>
        </div>
      )}

    </div>
  )
}
