'use client'

import { Lock as LockIcon, Map as MapIcon, MapPin, Target as TargetIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { asString, isRecord } from '@/lib/type-guards'
import { getLocalizedContent } from '@/lib/utils'
import { useState } from 'react'

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
  }
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string>('Tous')

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, locale),
  )

  return (
    <div className="w-full max-w-[1920px] mx-auto pb-8">
      {/* 2. LE HEADER & LES FILTRES */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-start">
        <h1 className="text-4xl font-black text-white tracking-tight">Nos projets</h1>
        <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-95">
          <MapIcon className="text-white w-5 h-5" />
        </button>
      </div>
      <p className="px-6 text-white/60 text-[15px] mb-6">Découvrez et soutenez des projets vérifiés.</p>

      <div className="px-6 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {['Tous', '🌳 Forêts', '🐝 Faune'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm ${
              activeCategory === category
                ? 'bg-lime-400 text-black font-bold'
                : 'bg-white/5 border border-white/10 text-white font-medium'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 3. L'ANATOMIE DE LA CARTE PROJET */}
      <div className="flex flex-col gap-6 px-6 mt-6 pb-32">
        {normalizedProjects.map((project) => {
          const imageUrl = sanitizeImageUrl(project.hero_image_url)
          const location =
            project.address_city && project.address_country_code
              ? `${project.address_city}`
              : 'Localisation mystère'

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block active:scale-[0.98] transition-transform duration-300"
            >
              {/* A. L'Image */}
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

                {project.featured && (
                  <span className="absolute top-4 left-4 bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Coup de cœur
                  </span>
                )}

                {/* LE TEASING BIODEX */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xl">
                  <LockIcon className="w-3.5 h-3.5 text-lime-400" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Espèce Mystère</span>
                </div>
              </div>

              {/* B. Le Texte */}
              <div className="flex flex-col gap-1 px-2">
                <h2 className="text-2xl font-black text-white leading-tight">
                  {project.name_default}
                </h2>

                <div className="flex items-center gap-1.5 text-white/50 text-sm mt-1 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-lg px-3 py-2 w-fit">
                  <TargetIcon className="w-4 h-4 text-lime-400 shrink-0" />
                  <span className="text-lime-400 text-sm font-bold line-clamp-1">
                    Objectif : {project.description_default || 'Soutenir la mission de ce projet'}
                  </span>
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
