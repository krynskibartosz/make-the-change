import {
  ArrowLeft,
  Bug,
  ChevronRight,
  ExternalLink,
  Hexagon,
  MapPin,
  Package,
  Sparkles,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FollowToggleButton } from '@/components/social/follow-toggle-button'
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
    <div className="bg-[#0B0F15] min-h-screen pb-32">

      {/* 1. HEADER : Cover + Avatar */}
      <div className="relative w-full h-48 bg-[#1A1F26]">
        <img src={coverImage} alt={producer.name_default || t('default_name')} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15]/60 to-transparent" />
        <div className="absolute top-14 left-4 right-4 flex justify-between">
          <Link href="/producers" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          {producer.contact_website && (
            <a href={producer.contact_website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform">
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      {/* IDENTITE & CTA */}
      <div className="px-5 relative">
        {/* Avatar logo — object-contain pour un logo, pas un paysage */}
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
            <h1 className="text-2xl font-black text-white tracking-tight">{producer.name_default || t('default_name')}</h1>
            {location && (
              <p className="text-white/50 text-sm flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-white/40" /> {location}
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

      {/* 2. GLOBAL IMPACT DASHBOARD (data pure, pas de badge vide) */}
      <div className="px-5 mt-6">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Impact Global Généré</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1A1F26] border border-white/5 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <span className="text-xl font-black text-white tabular-nums">{projects.length > 0 ? projects.length : '—'}</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-1">Projets</span>
          </div>
          <div className="bg-[#1A1F26] border border-lime-400/10 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <Bug className="w-4 h-4 text-lime-400 mb-1" />
            <span className="text-sm font-black text-white tabular-nums">290k</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Abeilles</span>
          </div>
          <div className="bg-[#1A1F26] border border-amber-500/10 rounded-2xl p-3 flex flex-col justify-center items-center text-center">
            <Hexagon className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-sm font-black text-white tabular-nums">58kg</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Miel</span>
          </div>
        </div>
      </div>

      {/* 3. VITRINE PRODUITS — Cross-selling horizontal */}
      {products.length > 0 && (
        <div className="mt-8 pl-5">
          <div className="flex justify-between items-end pr-5 mb-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Leurs Récompenses</h3>
            <Link href="/products" className="text-[11px] font-bold text-lime-400">Voir tout</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 pr-5 scrollbar-hide">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.slug ? `/products/${product.slug}` : '/products'}
                className="min-w-[140px] bg-[#1A1F26] border border-white/5 rounded-2xl p-2.5 text-left active:scale-95 transition-transform block shrink-0"
              >
                <div className="w-full aspect-square rounded-xl bg-white/5 mb-3 overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name_default || ''} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-white/20" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate">{product.name_default || t('default_product_name')}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lime-400 font-bold text-sm">•••</span>
                  <Sparkles className="w-3 h-3 text-lime-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROJETS avec thumbnails */}
      {projects.length > 0 && (
        <div className="px-5 mt-4 mb-8">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Soutenir leurs projets</h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.slug ? `/projects/${project.slug}` : '/projects'}
                className="w-full bg-[#1A1F26] border border-white/5 hover:bg-white/10 transition-colors rounded-2xl p-3 flex items-center gap-3 group text-left block"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0 overflow-hidden">
                  {project.hero_image_url ? (
                    <img src={project.hero_image_url} alt={project.name_default || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-lime-400/10 flex items-center justify-center">
                      <Bug className="w-5 h-5 text-lime-400/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[13px] truncate">{project.name_default || t('default_project_name')}</p>
                  <p className="text-lime-400 text-[11px] font-bold mt-0.5">
                    {project.status === 'active' ? '🟢 Actif' : project.status ? `🟡 ${project.status}` : '🟢 Actif'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. À PROPOS & CERTIFICATIONS — repoussés en bas */}
      {producer.description_default && (
        <div className="px-5 mt-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{t('about')}</h3>
          <p className="text-white/70 leading-relaxed text-[15px]">{producer.description_default}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{t('certifications')}</h3>
          <div className="flex flex-wrap gap-2">
            {certifications.map((item) => (
              <span key={item} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONTACT — tout en bas */}
      {producer.contact_website && (
        <div className="px-5 mt-8 border-t border-white/10 pt-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Contact</h3>
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
