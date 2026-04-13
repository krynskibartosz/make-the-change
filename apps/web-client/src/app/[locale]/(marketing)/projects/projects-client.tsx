'use client'

import { Lock as LockIcon, Map as MapIcon, MapPin, Bug as BugIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { asString, isRecord } from '@/lib/type-guards'
import { getLocalizedContent } from '@/lib/utils'
import { useState, useEffect } from 'react'

type RawClientProject = {
  id: string | null
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  target_budget: number | null
  current_funding: number | null
  funding_progress: number | null
  address_city: string | null
  address_country_code: string | null
  latitude: number | null
  longitude: number | null
  featured: boolean | null
  launch_date: string | null
  status: string | null
  hero_image_url: string | null
  type: string | null
  producer?:
    | {
        name_default?: string | null
        name_i18n?: Record<string, string> | null
        description_default?: string | null
        description_i18n?: Record<string, string> | null
      }
    | Record<string, unknown>
    | null
}

interface ProjectsClientProps {
  projects: RawClientProject[]
  initialStatus: string
  initialSearch: string
  initialView: 'grid' | 'list' | 'map'
}

type ClientProject = {
  id: string
  slug: string
  name_default: string
  description_default: string
  address_city: string | null
  address_country_code: string | null
  featured: boolean | null
  hero_image_url: string | null
  current_funding: number | null
}

const normalizeProject = (
  project: RawClientProject,
  index: number,
  locale: string,
): ClientProject => {
  const id = project.id || project.slug || `project-${index}`
  return {
    id,
    slug: project.slug || id,
    name_default: getLocalizedContent(
      project.name_i18n,
      locale,
      project.name_default || 'Projet mystère',
    ),
    description_default: getLocalizedContent(
      project.description_i18n,
      locale,
      project.description_default || '',
    ),
    address_city: project.address_city,
    address_country_code: project.address_country_code,
    featured: project.featured,
    hero_image_url: project.hero_image_url,
    current_funding: project.current_funding,
  }
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string>('Tous')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, locale),
  )

  return (
    <div className="w-full max-w-[1920px] mx-auto pb-8">
      {/* 2. L'EN-TÊTE FIXE (Sticky - Ligne 1 & Filtres) */}
      <div 
        className={`sticky top-0 z-50 transition-all duration-300 pt-14 pb-4 ${
          isScrolled 
            ? 'bg-[#0B0F15]/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        {/* LIGNE 1 : Petit Titre Dynamique & Bouton Carte */}
        <div className="flex justify-between items-center px-6 mb-5 h-10">
          <h2 
            className={`text-white font-bold text-xl transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Nos projets
          </h2>
          
          <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-colors shrink-0">
            <MapIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* LIGNE 2 : Filtres (Toujours visibles) */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-6 pb-1 -mx-6 pl-6">
          {['Tous', '🌳 Forêts', '🐝 Faune'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-lime-400 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white font-medium active:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LE GRAND TITRE (Fluide - Disparaît au scroll) */}
      <div className="px-6 pt-2 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Nos projets</h1>
        <p className="text-white/60 text-[15px] mt-2">Découvrez et soutenez des projets vérifiés.</p>
      </div>

      {/* 3. L'ANATOMIE DE LA CARTE PROJET */}
      <div className="flex flex-col gap-8 px-6 mt-4 pb-32">
        {normalizedProjects.map((project) => {
          const imageUrl = sanitizeImageUrl(project.hero_image_url)
          const location =
            project.address_city && project.address_country_code
              ? `${project.address_city}, ${project.address_country_code}`
              : 'Localisation mystère'
          
          // Conversion du budget en métrique d'impact social
          const impactValue = project.current_funding || 133380

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block text-left active:scale-[0.98] transition-transform duration-200"
            >
              {/* A. L'Image et le Teasing BioDex */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-white/5">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={project.name_default}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10" />
                )}

                {/* Le Macaron BioDex (En bas à droite) */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="/silhouette-animal.png" 
                      alt="BioDex Silhouette" 
                      className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
                    />
                  </div>
                  <LockIcon className="w-4 h-4 text-white/50 mr-1" />
                </div>
              </div>

              {/* B. Le Contenu Textuel (Typographie Millimétrée) */}
              <div className="flex flex-col gap-1 px-1">
                <h2 className="text-[22px] font-black text-white leading-tight tracking-tight">
                  {project.name_default}
                </h2>

                <div className="flex items-center gap-1.5 text-white/50 text-[13px] font-medium mt-0.5 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </div>

                {/* L'Impact Collectif */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                    <BugIcon className="w-3 h-3 text-lime-400" />
                  </div>
                  <p className="text-sm text-white/70">
                    <span className="text-lime-400 font-bold">
                      {impactValue.toLocaleString('fr-FR')}
                    </span> actions concrètes déjà menées
                  </p>
                </div>
              </div>
            </Link>
          )
        })}

        {normalizedProjects.length === 0 && (
          <div className="text-center text-white/50 py-12">
            Aucun projet trouvé pour le moment.
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsClient
