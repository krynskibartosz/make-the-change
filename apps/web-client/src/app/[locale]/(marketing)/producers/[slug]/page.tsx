import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  ShieldCheck,
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
    <div className="bg-[#0B0F15] min-h-screen pb-safe">
      
      {/* 1. LE HEADER "SOCIAL PROFILE" (Cover + Avatar) */}
      <div className="relative w-full h-48 bg-[#1A1F26]">
        <img src={coverImage} alt={producer.name_default || t('default_name')} className="w-full h-full object-cover" />
        
        {/* Boutons de navigation (par-dessus l'image) */}
        <div className="absolute top-14 left-4 right-4 flex justify-between">
          <Link href="/producers" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-white"/></Link>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform pointer-events-none opacity-0"><ExternalLink className="w-5 h-5 text-white"/></button> {/* Bouton masqué pour l'équilibre si pas de share au niveau UX fourni */}
        </div>
      </div>

      {/* IDENTITÉ & CALL-TO-ACTION */}
      <div className="px-5 relative">
        {/* Avatar qui chevauche la cover */}
        <div className="absolute -top-12 left-5 w-24 h-24 rounded-2xl bg-[#0B0F15] p-1 border-[3px] border-[#0B0F15] z-10 shadow-xl">
          <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            <img src={images[1] || coverImage} alt={`${producer.name_default || t('default_name')} avatar`} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Espace pour compenser l'avatar */}
        <div className="h-14"></div>

        {/* Titre et Bouton Suivre */}
        <div className="flex justify-between items-start mt-2">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{producer.name_default || t('default_name')}</h1>
            {location ? (
              <p className="text-white/50 text-sm flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-white/40" /> {location}
              </p>
            ) : null}
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

      {/* 2. LE MINI-BENTO D'IMPACT (La preuve sociale immédiate) */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-3">
        {projects.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Projets actifs</span>
            <span className="text-xl font-black text-white">{projects.length}</span>
          </div>
        )}

        {products.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Produits liés</span>
            <span className="text-xl font-black text-white">{products.length}</span>
          </div>
        )}
        
        {/* Tag "Producteur Engagé" mis en valeur (Bouche les trous) */}
        <div className={`bg-lime-400/10 border border-lime-400/20 rounded-2xl p-4 flex flex-col justify-center items-center text-center ${projects.length === 0 || products.length === 0 ? 'col-span-1' : 'col-span-2'}`}>
          <ShieldCheck className="w-6 h-6 text-lime-400 mb-1" />
          <span className="text-xs font-bold text-lime-400 uppercase tracking-wide">Producteur<br/>Engagé</span>
        </div>
      </div>

      {/* 3. LE STORYTELLING ("À propos" sans boîte noire) */}
      {producer.description_default && (
        <div className="px-5 mt-8">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{t('about')}</h3>
          <p className="text-white/80 leading-relaxed text-[15px]">
            {producer.description_default}
          </p>
        </div>
      )}

      {/* 4. LA GESTION CONDITIONNELLE (Certifications & Projets) */}
      {certifications.length > 0 && (
        <div className="px-5 mt-8">
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

      {projects.length > 0 && (
        <div className="px-5 mt-8 mb-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Leurs Projets ({projects.length})</h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.slug ? `/projects/${project.slug}` : '/projects'}
                className="w-full bg-[#1A1F26] border border-white/5 hover:bg-white/5 transition-colors rounded-2xl p-4 flex items-center justify-between group text-left block"
              >
                <div>
                  <p className="text-white font-bold text-sm">{project.name_default || t('default_project_name')}</p>
                  <p className="text-lime-400 text-xs font-medium mt-0.5">🟢 {project.status || 'Actif'}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. LE BOUTON CONTACT (Call to Action Secondaire) */}
      {producer.contact_website && (
        <div className="px-5 mt-8 mb-32 border-t border-white/10 pt-6">
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
