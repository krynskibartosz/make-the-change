'use client'

import { LayoutGroup, motion, type Transition } from 'framer-motion'
import { List, Map as MapIcon, MapPin } from 'lucide-react'
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
import { ImpactKindIcon } from '@/lib/impact-icons'
import { getProjectImpactDisplay, type ProjectMapImpactKind } from './_features/project-map-data'

// ─── Types ────────────────────────────────────────────────────────────────────
type ServerProjectPayload = {
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
  projects: ServerProjectPayload[]
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
  equipment: {
    bg: 'bg-amber-400/15',
    icon: 'text-amber-300',
  },
}

const normalizeProject = (
  project: ServerProjectPayload,
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


function ProjectCard({ project, locale }: { project: ClientProject; locale: string }) {
  const imageUrl = sanitizeImageUrl(project.hero_image_url)
  const locationDisplay = resolveLocationDisplay(
    project.address_country_code,
    project.address_city,
    locale,
  )
  const impact = getProjectImpactDisplay(project)
  const impactTheme = IMPACT_KIND_STYLES[impact.kind]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block text-left active:scale-[0.98] transition-transform duration-200"
    >
      <div className="relative w-full aspect-[4/3] max-h-[260px] rounded-3xl overflow-hidden mb-3 bg-white/5">
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

      <div className="flex flex-col px-1">
        <h3 className="text-[22px] font-black text-white leading-[1.1] tracking-tight text-balance">
          {project.name_default}
        </h3>

        <div className="flex items-center gap-1.5 text-white/50 text-[13px] mt-2">
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

        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-6 h-6 rounded-full ${impactTheme.bg} flex items-center justify-center shrink-0`}
          >
            <ImpactKindIcon kind={impact.kind} className={`w-3 h-3 ${impactTheme.icon}`} />
          </div>
          {impact.value > 0 ? (
            <p className="text-[13px]">
              <span className="text-white/90 font-black tabular-nums tracking-tight">
                {formatCompact(impact.value)}
              </span>{' '}
              <span className="text-white/70 font-medium">{impact.label}</span>
            </p>
          ) : (
            <p className="text-[13px] text-white/70">{impact.label}</p>
          )}
        </div>
      </div>
    </Link>
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

  const donationProjects = useMemo(
    () => normalizedProjects.filter((p) => p.type === 'reef'),
    [normalizedProjects],
  )
  const supportProjects = useMemo(
    () => normalizedProjects.filter((p) => p.type !== 'reef'),
    [normalizedProjects],
  )

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
        className={`w-full min-h-screen bg-[#0B0F15] overflow-x-hidden relative pb-[calc(11rem+env(safe-area-inset-bottom))] transition-opacity duration-300 ${isMapView ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        aria-hidden={isMapView}
      >
        {/* ── TITRE (scroll avec le contenu) ──────────────────────────────── */}
        <div className="px-6 pt-6 pb-3">
          <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
            Nos projets
          </h1>
        </div>

        {/* ── SECTIONS ÉDITORIALES ─────────────────────────────────────────── */}
        <div className="flex flex-col">
          {normalizedProjects.length === 0 ? (
            <div className="px-6 py-12 text-center text-white/50">
              Aucun projet trouvé pour le moment.
            </div>
          ) : (
            <>
              {donationProjects.length > 0 && (
                <section className="px-6">
                  <div className="mb-8">
                    <h2 className="text-[20px] font-black leading-tight tracking-tight text-white">
                      Faire un don
                    </h2>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-white/50">
                      Contribuez directement à une action de terrain. Sans contrepartie — avec un suivi clair du projet.
                    </p>
                  </div>
                  <div className="flex flex-col gap-14">
                    {donationProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} locale={locale} />
                    ))}
                  </div>
                </section>
              )}

              {supportProjects.length > 0 && (
                <section className={`px-6${donationProjects.length > 0 ? ' mt-20' : ''}`}>
                  <div className="mb-8">
                    <h2 className="text-[20px] font-black leading-tight tracking-tight text-white">
                      Soutenir un producteur
                    </h2>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-white/50">
                      Accompagnez un partenaire engagé et sa filière. Votre soutien crée de la valeur sur le terrain.
                    </p>
                  </div>
                  <div className="flex flex-col gap-14">
                    {supportProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} locale={locale} />
                    ))}
                  </div>
                </section>
              )}
            </>
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
