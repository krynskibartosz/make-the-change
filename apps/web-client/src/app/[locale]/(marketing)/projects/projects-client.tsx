'use client'

import { Lock as LockIcon, Map as MapIcon, MapPin } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import { useState, useEffect } from 'react'

// ─── Constants (coherent with project-species-impact-section.tsx) ────────────
const BEEHIVE_REFERENCE_VALUE_EUR = 1300
const BEEHIVE_REFERENCE_POPULATION = 50000
const BEES_PER_EUR = BEEHIVE_REFERENCE_POPULATION / BEEHIVE_REFERENCE_VALUE_EUR

// ─── Types ────────────────────────────────────────────────────────────────────
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
    hero_image_url: project.hero_image_url,
    current_funding: project.current_funding,
  }
}

// Silhouette SVG d'abeille (inline, pas de dépendance externe)
function BeeSilhouette() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-30 text-white">
      <path d="M12 2C9.8 2 8 3.8 8 6v1H6.5C5.1 7 4 8.1 4 9.5v2C4 13.4 5.6 15 7.5 15H8v1.5C8 19 9.8 21 12 21s4-2 4-4.5V15h.5c1.9 0 3.5-1.6 3.5-3.5v-2C20 8.1 18.9 7 17.5 7H16V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm-4 5h8v.5c0 .8-.7 1.5-1.5 1.5H8.5C7.7 11 7 10.3 7 9.5V9h1zm1 4h6v1.5C15 18 13.7 19 12 19s-3-1-3-3.5V13z"/>
    </svg>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'forets', label: '🌳 Forêts' },
  { id: 'faune', label: '🐝 Faune' },
  { id: 'oceans', label: '🌊 Océans' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function ProjectsClient({ projects }: ProjectsClientProps) {
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, locale),
  )

  return (
    // Wrapper principal — overflow-x-hidden corrige le scroll horizontal cassé
    <div className="w-full min-h-screen bg-[#0B0F15] overflow-x-hidden relative pb-40">

      {/* ── TOP HEADER (Safe Area + fond solide) ───────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#0B0F15] pt-14 pb-4 px-6 flex justify-between items-center border-b border-white/5">
        <h1 className="text-2xl font-black text-white tracking-tight">Nos projets</h1>
        <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-colors shrink-0">
          <MapIcon className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ── GRAND TITRE FLUIDE (glisse sous le header au scroll) ───────────── */}
      <div className="px-6 pt-4 pb-6">
        <p className="text-white/60 text-[15px]">Découvrez et soutenez des projets vérifiés.</p>
      </div>

      {/* ── LISTE DES CARTES ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 px-6 mt-2 pb-32">
        {normalizedProjects.map((project) => {
          const imageUrl = sanitizeImageUrl(project.hero_image_url)
          const location =
            project.address_city && project.address_country_code
              ? `${project.address_city}, ${project.address_country_code}`
              : 'Localisation mystère'

          // Impact réel cohérent avec project-species-impact-section.tsx
          const funding = project.current_funding || 0
          const beesProtected = Math.round(funding * BEES_PER_EUR)

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block text-left active:scale-[0.98] transition-transform duration-200"
            >
              {/* A. Image + Teasing BioDex */}
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

                {/* Macaron BioDex — silhouette + cadenas, sans texte */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    <BeeSilhouette />
                  </div>
                  <LockIcon className="w-4 h-4 text-white/50 mr-1" />
                </div>
              </div>

              {/* B. Contenu textuel — typo millimétrée */}
              <div className="flex flex-col gap-1 px-1">
                <h2 className="text-[22px] font-black text-white leading-tight tracking-tight">
                  {project.name_default}
                </h2>

                <div className="flex items-center gap-1.5 text-white/50 text-[13px] font-medium mt-0.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{location}</span>
                </div>

                {/* Impact collectif — donnée réelle calculée comme la page détail */}
                {beesProtected > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-lime-400">
                        <path d="M12 2C9.8 2 8 3.8 8 6v1H6.5C5.1 7 4 8.1 4 9.5v2C4 13.4 5.6 15 7.5 15H8v1.5C8 19 9.8 21 12 21s4-2 4-4.5V15h.5c1.9 0 3.5-1.6 3.5-3.5v-2C20 8.1 18.9 7 17.5 7H16V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm-4 5h8v.5c0 .8-.7 1.5-1.5 1.5H8.5C7.7 11 7 10.3 7 9.5V9h1zm1 4h6v1.5C15 18 13.7 19 12 19s-3-1-3-3.5V13z"/>
                      </svg>
                    </div>
                    <p className="text-[13px] text-white/70">
                      <span className="text-lime-400 font-bold">
                        {beesProtected.toLocaleString('fr-FR')}
                      </span>{' '}
                      abeilles protégées
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-lime-400">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                      </svg>
                    </div>
                    <p className="text-[13px] text-white/70">
                      Collecte en cours de démarrage
                    </p>
                  </div>
                )}
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

      {/* ── FILTRES FLOTTANTS EN BAS (Thumb Zone) ──────────────────────────── */}
      <div className="fixed bottom-24 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-3 bg-[#0B0F15]/70 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto mx-auto w-max max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm shrink-0 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-lime-400 text-black font-bold'
                  : 'bg-transparent hover:bg-white/10 text-white font-medium'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsClient
