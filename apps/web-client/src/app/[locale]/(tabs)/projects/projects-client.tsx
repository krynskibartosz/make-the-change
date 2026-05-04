'use client'

import { Lock as LockIcon, Map as MapIcon, MapPin, TreePine, Waves } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCallback } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import { getProjectImpactDisplay } from './_features/project-map-data'

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
  unit_label: string | null
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
  latitude: number | null
  longitude: number | null
  hero_image_url: string | null
  current_funding: number | null
  type: string | null
  unit_label: string | null
}

const ProjectsMapView = dynamic(
  () => import('./components/projects-maplibre-view').then((module) => module.ProjectsMapView),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#05070A] text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent" />
          <p className="text-sm font-bold text-white/70">Chargement de la carte...</p>
        </div>
      </div>
    ),
  },
)

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
    latitude: project.latitude,
    longitude: project.longitude,
    hero_image_url: project.hero_image_url,
    current_funding: project.current_funding,
    type: project.type,
    unit_label: project.unit_label,
  }
}

// Silhouette SVG d'abeille (inline, pas de dépendance externe)
function BeeSilhouette() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-30 text-white">
      <path d="M12 2C9.8 2 8 3.8 8 6v1H6.5C5.1 7 4 8.1 4 9.5v2C4 13.4 5.6 15 7.5 15H8v1.5C8 19 9.8 21 12 21s4-2 4-4.5V15h.5c1.9 0 3.5-1.6 3.5-3.5v-2C20 8.1 18.9 7 17.5 7H16V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm-4 5h8v.5c0 .8-.7 1.5-1.5 1.5H8.5C7.7 11 7 10.3 7 9.5V9h1zm1 4h6v1.5C15 18 13.7 19 12 19s-3-1-3-3.5V13z" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProjectsClient({ projects, initialView }: ProjectsClientProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, locale),
  )
  const queryView = searchParams.get('view')
  const viewMode = queryView === 'map' || (!queryView && initialView === 'map') ? 'map' : 'grid'

  const updateViewMode = useCallback(
    (nextView: 'grid' | 'map') => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextView === 'map') {
        params.set('view', 'map')
      } else {
        params.delete('view')
      }

      const nextQuery = params.toString()
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
    },
    [pathname, router, searchParams],
  )

  if (viewMode === 'map') {
    return (
      <ProjectsMapView
        projects={normalizedProjects}
        onShowCurrentView={() => updateViewMode('grid')}
      />
    )
  }

  return (
    // Wrapper principal — overflow-x-hidden corrige le scroll horizontal cassé
    <div className="w-full min-h-screen bg-[#0B0F15] overflow-x-hidden relative pb-40">
      {/* ── TITRE & DESCRIPTION (scroll avec le contenu) ─────────────────── */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
          Nos projets
        </h1>
        <p className="text-white/60 text-[15px] mt-3 font-medium">
          Découvrez et soutenez des projets vérifiés.
        </p>
      </div>

      {/* ── LISTE DES CARTES ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 px-6 pb-40">
        {normalizedProjects.map((project) => {
          const imageUrl = sanitizeImageUrl(project.hero_image_url)
          const location =
            project.address_city && project.address_country_code
              ? `${project.address_city}, ${project.address_country_code}`
              : 'Localisation mystère'

          // Impact réel cohérent avec project-species-impact-section.tsx
          const impact = getProjectImpactDisplay(project)
          const impactValue = impact.value
          const impactLabel = impact.label
          const projectType = impact.kind

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
                <h2 className="text-[22px] font-black text-white leading-[1.1] tracking-tight text-balance">
                  {project.name_default}
                </h2>

                <div className="flex items-center gap-1.5 text-white/50 text-[13px] mt-0.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="tracking-wide font-medium">{location}</span>
                </div>

                {/* Impact collectif — donnée réelle calculée comme la page détail */}
                {impactValue > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                      {projectType === 'orchard' ? (
                        <TreePine className="w-3 h-3 text-lime-400" />
                      ) : projectType === 'reef' ? (
                        <Waves className="w-3 h-3 text-lime-400" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3 h-3 text-lime-400"
                        >
                          <path d="M12 2C9.8 2 8 3.8 8 6v1H6.5C5.1 7 4 8.1 4 9.5v2C4 13.4 5.6 15 7.5 15H8v1.5C8 19 9.8 21 12 21s4-2 4-4.5V15h.5c1.9 0 3.5-1.6 3.5-3.5v-2C20 8.1 18.9 7 17.5 7H16V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm-4 5h8v.5c0 .8-.7 1.5-1.5 1.5H8.5C7.7 11 7 10.3 7 9.5V9h1zm1 4h6v1.5C15 18 13.7 19 12 19s-3-1-3-3.5V13z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[13px]">
                      <span className="text-lime-400 font-black tabular-nums tracking-tight">
                        {formatCompact(impactValue)}
                      </span>{' '}
                      <span className="text-white/70 font-medium">{impactLabel}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-3 h-3 text-lime-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </div>
                    <p className="text-[13px] text-white/70">Collecte en cours de démarrage</p>
                  </div>
                )}
              </div>
            </Link>
          )
        })}

        {normalizedProjects.length === 0 && (
          <div className="text-center text-white/50 py-12">Aucun projet trouvé pour le moment.</div>
        )}
      </div>

      {/* ── DOCK FLOTTANT PREMIUM (Thumb Zone) ────────────────────────────── */}
      {/* bottom = hauteur nav (4.5rem) + safe-area-bottom + gap 8px */}
      <div
        className="fixed mb-1 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.5rem)' }}
      >
        <div className="bg-background/80  backdrop-blur-lg border border-border/70 p-1 rounded-full flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] pointer-events-auto overflow-x-auto scrollbar-hide max-w-full">
          {/* Bouton Map — à gauche du dock */}
          <button
            type="button"
            onClick={() => updateViewMode('map')}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 text-white/70 transition-all active:scale-95 shrink-0 mx-1"
            aria-label="Afficher la carte des projets"
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsClient
