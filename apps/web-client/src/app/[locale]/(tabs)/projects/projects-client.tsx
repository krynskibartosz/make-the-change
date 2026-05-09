'use client'

import { LayoutGroup, motion, type Transition } from 'framer-motion'
import { List, Map as MapIcon, MapPin, PawPrint, TreePine, Waves } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveLocationDisplay } from '@/lib/location'
import { getLocalizedContent } from '@/lib/utils'
import type {
  ProjectListSpeciesSeed,
  ProjectSpeciesPreview,
} from './_features/project-list-species'
import { getProjectImpactDisplay, type ProjectMapImpactKind } from './_features/project-map-data'

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
  species?: ProjectListSpeciesSeed[] | null
  linked_species?: ProjectSpeciesPreview[] | null
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
  linked_species: ProjectSpeciesPreview[] | null
}

const ProjectsMapView = dynamic(
  () => import('./_components/projects-maplibre-view').then((module) => module.ProjectsMapView),
  {
    ssr: false,
    loading: () => null,
  },
)

const DOCK_LAYOUT_ID = 'projects-view-island'
const DOCK_TRANSITION = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
}
const VIEW_SWITCHER_BOTTOM = 'calc(4.5rem + env(safe-area-inset-bottom) + 0.9rem)'
const IMPACT_KIND_STYLES: Record<ProjectMapImpactKind, { bg: string; icon: string }> = {
  beehive: {
    bg: 'bg-amber-400/15',
    icon: 'text-amber-300',
  },
  orchard: {
    bg: 'bg-emerald-400/15',
    icon: 'text-emerald-300',
  },
  reef: {
    bg: 'bg-sky-400/15',
    icon: 'text-sky-300',
  },
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
    latitude: project.latitude,
    longitude: project.longitude,
    hero_image_url: project.hero_image_url,
    current_funding: project.current_funding,
    type: project.type,
    unit_label: project.unit_label,
    linked_species: project.linked_species || null,
  }
}

// Silhouette SVG d'abeille (inline, pas de dépendance externe)
function BeeSilhouette({ className = 'w-5 h-5 opacity-30 text-white' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C9.8 2 8 3.8 8 6v1H6.5C5.1 7 4 8.1 4 9.5v2C4 13.4 5.6 15 7.5 15H8v1.5C8 19 9.8 21 12 21s4-2 4-4.5V15h.5c1.9 0 3.5-1.6 3.5-3.5v-2C20 8.1 18.9 7 17.5 7H16V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm-4 5h8v.5c0 .8-.7 1.5-1.5 1.5H8.5C7.7 11 7 10.3 7 9.5V9h1zm1 4h6v1.5C15 18 13.7 19 12 19s-3-1-3-3.5V13z" />
    </svg>
  )
}

function ProjectSpeciesTeaser({ species }: { species: ProjectSpeciesPreview[] | null }) {
  if (!species || species.length === 0) {
    return null
  }

  const firstSpecies = species[0]
  if (!firstSpecies) {
    return null
  }

  const unlockedSpecies = species.find((entry) => entry.isUnlocked)
  const isLocked = !unlockedSpecies
  const mainSpecies = unlockedSpecies || firstSpecies

  const label =
    species.length === 1
      ? isLocked
        ? `BioDex : ${mainSpecies.name} à débloquer`
        : `Espèce liée : ${mainSpecies.name}`
      : `${mainSpecies.name} · +${species.length - 1} espèces liées`

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
        {firstSpecies.imageUrl ? (
          <img
            src={firstSpecies.imageUrl}
            alt=""
            className={`h-full w-full object-cover ${isLocked ? 'scale-110 grayscale blur-[1.5px] opacity-45' : 'opacity-85'}`}
          />
        ) : (
          <PawPrint className={`h-3.5 w-3.5 ${isLocked ? 'text-white/30' : 'text-white/60'}`} />
        )}
        {isLocked ? <div className="absolute inset-0 bg-black/20" aria-hidden /> : null}
      </div>
      <p className="text-[13px] font-medium text-white/58">{label}</p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProjectsClient({ projects, initialView }: ProjectsClientProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalizedProjects = useMemo(
    () => projects.map((project, index) => normalizeProject(project, index, locale)),
    [locale, projects],
  )
  const queryView = searchParams.get('view')
  const viewMode = queryView === 'map' || (!queryView && initialView === 'map') ? 'map' : 'grid'
  const isMapView = viewMode === 'map'
  const [shouldMountMap, setShouldMountMap] = useState(isMapView)
  const [isMapShellReady, setIsMapShellReady] = useState(false)

  useEffect(() => {
    if (isMapView) {
      setShouldMountMap(true)
    }
  }, [isMapView])

  useEffect(() => {
    if (shouldMountMap || normalizedProjects.length === 0) {
      return
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      const idleHandle = idleWindow.requestIdleCallback(() => setShouldMountMap(true), {
        timeout: 2500,
      })
      return () => idleWindow.cancelIdleCallback?.(idleHandle)
    }

    const timeoutId = window.setTimeout(() => setShouldMountMap(true), 1600)
    return () => window.clearTimeout(timeoutId)
  }, [normalizedProjects.length, shouldMountMap])

  const updateViewMode = useCallback(
    (nextView: 'grid' | 'map') => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextView === 'map') {
        setShouldMountMap(true)
        params.set('view', 'map')
      } else {
        params.delete('view')
      }

      const nextQuery = params.toString()
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
    },
    [pathname, router, searchParams],
  )

  const showMapBootPlaceholder = isMapView && !isMapShellReady
  const handleMapShellReady = useCallback(() => {
    setIsMapShellReady(true)
  }, [])

  return (
    <LayoutGroup id="projects-view-layout">
      {showMapBootPlaceholder && (
        <ProjectsMapBootPlaceholder
          dockLayoutId={DOCK_LAYOUT_ID}
          dockTransition={DOCK_TRANSITION}
          onShowCurrentView={() => updateViewMode('grid')}
        />
      )}

      {shouldMountMap && (
        <ProjectsMapView
          isVisible={isMapView}
          isBootPlaceholderVisible={showMapBootPlaceholder}
          projects={normalizedProjects}
          dockLayoutId={DOCK_LAYOUT_ID}
          dockTransition={DOCK_TRANSITION}
          onShellReady={handleMapShellReady}
          onShowCurrentView={() => updateViewMode('grid')}
        />
      )}

      <div
        className={`w-full min-h-screen bg-[#0B0F15] overflow-x-hidden relative pb-40 transition-opacity duration-300 ${isMapView ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        aria-hidden={isMapView}
      >
        {/* ── TITRE & DESCRIPTION (scroll avec le contenu) ─────────────────── */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
            Nos projets
          </h1>
          <p className="text-white/60 text-[15px] mt-3 font-medium">
            Découvrez et soutenez des projets de terrain sélectionnés.
          </p>
        </div>

        {/* ── LISTE DES CARTES ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 px-6 pb-40">
          {normalizedProjects.map((project) => {
            const imageUrl = sanitizeImageUrl(project.hero_image_url)
            const locationDisplay = resolveLocationDisplay(
              project.address_country_code,
              project.address_city,
              locale,
            )

            // Impact réel cohérent avec project-species-impact-section.tsx
            const impact = getProjectImpactDisplay(project)
            const impactValue = impact.value
            const impactLabel = impact.label
            const projectType = impact.kind
            const impactTheme = IMPACT_KIND_STYLES[projectType]

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block text-left active:scale-[0.98] transition-transform duration-200"
              >
                {/* A. Image */}
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
                </div>

                {/* B. Contenu textuel — typo millimétrée */}
                <div className="flex flex-col gap-1 px-1">
                  <h2 className="text-[22px] font-black text-white leading-[1.1] tracking-tight text-balance">
                    {project.name_default}
                  </h2>

                  <div className="flex items-center gap-1.5 text-white/50 text-[13px] mt-0.5 mb-2">
                    {locationDisplay ? (
                      <>
                        <span className="text-[15px] leading-none">{locationDisplay.flag}</span>
                        <span className="tracking-wide font-medium">{locationDisplay.label}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="tracking-wide font-medium">Localisation mystère</span>
                      </>
                    )}
                  </div>

                  {/* Impact collectif — donnée réelle calculée comme la page détail */}
                  {impactValue > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full ${impactTheme.bg} flex items-center justify-center shrink-0`}
                      >
                        {projectType === 'orchard' ? (
                          <TreePine className={`w-3 h-3 ${impactTheme.icon}`} />
                        ) : projectType === 'reef' ? (
                          <Waves className={`w-3 h-3 ${impactTheme.icon}`} />
                        ) : (
                          <BeeSilhouette className={`w-3 h-3 ${impactTheme.icon}`} />
                        )}
                      </div>
                      <p className="text-[13px]">
                        <span className="text-white/90 font-black tabular-nums tracking-tight">
                          {formatCompact(impactValue)}
                        </span>{' '}
                        <span className="text-white/70 font-medium">{impactLabel}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full ${impactTheme.bg} flex items-center justify-center shrink-0`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`w-3 h-3 ${impactTheme.icon}`}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <p className="text-[13px] text-white/70">Collecte en cours de démarrage</p>
                    </div>
                  )}
                  <ProjectSpeciesTeaser species={project.linked_species} />
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

        {/* ── DOCK FLOTTANT PREMIUM (Thumb Zone) ────────────────────────────── */}
        {/* bottom = hauteur nav (4.5rem) + safe-area-bottom + gap 8px */}
        {!isMapView && (
          <div
            className="fixed  left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
            style={{ bottom: VIEW_SWITCHER_BOTTOM }}
          >
            <motion.div
              layout
              layoutId={DOCK_LAYOUT_ID}
              transition={DOCK_TRANSITION}
              initial={false}
              animate={{ borderRadius: 999, padding: 4 }}
              className="pointer-events-auto flex w-fit max-w-full transform-gpu items-center justify-center overflow-hidden border border-white/10 bg-[#0B0F15]/92 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl will-change-transform"
              style={{ width: 'fit-content' }}
            >
              {/* Bouton Map — à gauche du dock */}
              <motion.button
                type="button"
                onClick={() => updateViewMode('map')}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-lime-400 px-5 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.2)] transition active:scale-[0.98]"
                aria-label="Afficher la carte des projets"
              >
                <MapIcon className="h-4 w-4" />
                Carte
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </LayoutGroup>
  )
}

function ProjectsMapBootPlaceholder({
  dockLayoutId,
  dockTransition,
  onShowCurrentView,
}: {
  dockLayoutId: string
  dockTransition: Transition
  onShowCurrentView: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden bg-[#08111A] text-white"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Préparation de la carte des projets"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(163,230,53,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.07)_1px,transparent_1px)] [background-size:44px_44px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-16%] top-[6%] h-[25%] w-[58%] rounded-[52%] bg-[#123225]/72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-18%] top-[22%] h-[28%] w-[62%] rounded-[50%] bg-[#0E2A3B]/68"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[18%] left-[12%] h-[20%] w-[48%] rounded-[48%] bg-[#182A1D]/66"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#05070A]/35" aria-hidden />

      <motion.section
        layout
        layoutId={dockLayoutId}
        transition={dockTransition}
        initial={false}
        animate={{ borderRadius: 999, padding: 4 }}
        className="fixed inset-x-0 z-[60] mx-auto w-fit max-w-[calc(100%-1.5rem)] transform-gpu overflow-hidden border border-white/10 bg-[#0B0F15]/92 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl will-change-transform"
        style={{ bottom: VIEW_SWITCHER_BOTTOM }}
      >
        <div className="flex max-w-full items-center gap-1.5">
          <button
            type="button"
            onClick={onShowCurrentView}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white/[0.08] px-4 text-[13px] font-black text-white/82 transition hover:bg-white/[0.12] active:scale-[0.98]"
            aria-label="Revenir à la liste des projets"
          >
            <List className="h-4 w-4" />
            Liste
          </button>
          <div
            className="relative flex h-11 min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-lime-400 px-3 text-[13px] font-black text-[#0B0F15] shadow-[0_8px_24px_rgba(163,230,53,0.2)]"
            aria-live="polite"
          >
            <motion.span
              className="absolute inset-y-0 left-0 w-16 bg-white/35"
              animate={{ x: ['-110%', '680%'] }}
              transition={{ duration: 1.45, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[#0B0F15]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#0B0F15]/45" />
            </span>
            <span className="relative truncate">Carte en préparation</span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default ProjectsClient
