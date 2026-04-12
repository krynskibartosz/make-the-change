'use client'

import { Button, Input } from '@make-the-change/core/ui'
import { LayoutGrid, List, Map, Search, Sparkles, Target } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import {
  type ClientCatalogProject,
  ClientCatalogProjectCard,
} from '@/app/[locale]/(marketing)/projects/components/client-catalog-project-card'
import { ProjectsGoogleMapView } from '@/app/[locale]/(marketing)/projects/components/projects-google-map-view'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { asString, isRecord } from '@/lib/type-guards'
import { getLocalizedContent } from '@/lib/utils'

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

const normalizeProject = (
  project: RawClientProject,
  index: number,
  fallbackName: string,
  locale: string,
): ClientCatalogProject => {
  const id = project.id || project.slug || `project-${index}`
  const producerRecord = isRecord(project.producer) ? project.producer : null
  const producerName = producerRecord
    ? getLocalizedContent(
        isRecord(producerRecord.name_i18n) ? producerRecord.name_i18n : null,
        locale,
        asString(producerRecord.name_default),
      )
    : undefined

  const producer = producerName ? { name_default: producerName } : null

  return {
    id,
    slug: project.slug || id,
    name_default: getLocalizedContent(
      project.name_i18n,
      locale,
      project.name_default || fallbackName,
    ),
    description_default: getLocalizedContent(
      project.description_i18n,
      locale,
      project.description_default || '',
    ),
    target_budget: project.target_budget,
    current_funding: project.current_funding,
    funding_progress: project.funding_progress,
    address_city: project.address_city,
    address_country_code: project.address_country_code,
    latitude: project.latitude,
    longitude: project.longitude,
    featured: project.featured,
    status: project.status,
    hero_image_url: project.hero_image_url,
    type: project.type,
    ...(producer !== null ? { producer } : {}),
  }
}

export function ProjectsClient({
  projects,
  initialStatus,
  initialSearch,
  initialView,
}: ProjectsClientProps) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [view, setView] = useState<'grid' | 'list' | 'map'>(initialView)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const updateFilters = useCallback(
    (newSearch: string, newStatus: string, newView: 'grid' | 'list' | 'map') => {
      const params = new URLSearchParams()
      if (newSearch) params.set('search', newSearch)
      if (newStatus && newStatus !== 'all') params.set('status', newStatus)
      if (newView !== 'grid') params.set('view', newView)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateFilters(search, status, view)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, initialSearch, status, view, updateFilters])

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    updateFilters(search, newStatus, view)
  }

  const handleViewChange = (newView: 'grid' | 'list' | 'map') => {
    setView(newView)
    updateFilters(search, status, newView)
  }

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, t('card.view_details'), locale),
  )
  const isProjectsListPath =
    pathname === `/${locale}/projects` || pathname === `/${locale}/projects/`
  const shouldShowFloatingFilters = normalizedProjects.length > 5 && isProjectsListPath
  const formatEuroAmount = (value: number): string =>
    `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} €`

  return (
    <>
      {/* Page Hero Section */}
      <div className="py-8 md:pb-12 md:pt-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {shouldShowFloatingFilters && (
        <>
          {/* Desktop sticky top search bar — hidden on mobile */}
          <div className="hidden md:block sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            <div className="w-full max-w-[1920px] mx-auto px-8 lg:px-12 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full lg:w-auto lg:gap-4">
                  <search role="search" className="relative w-full lg:w-[320px]">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      type="search"
                      placeholder={t('filter.search_placeholder')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 bg-background"
                      aria-label={t('filter.search_placeholder')}
                    />
                  </search>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full lg:w-auto pb-2 lg:pb-0">
                  {[
                    { id: 'all', label: t('filter.status.all') },
                    { id: 'active', label: t('filter.status.active') },
                    { id: 'completed', label: 'Financés' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleStatusChange(option.id)}
                      className={`whitespace-nowrap outline-none ${
                        status === option.id
                          ? 'rounded-full bg-lime-400 text-black font-bold px-5 py-2 transition-transform active:scale-95'
                          : 'rounded-full bg-white/5 border border-white/10 text-muted-foreground px-5 py-2 font-medium transition-all hover:text-white active:scale-95'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile floating pill */}
          {portalRoot
            ? createPortal(
                <div
                  className="md:hidden fixed left-0 right-0 z-[60] px-4"
                  style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.85rem)' }}
                >
                  <div className="bg-[#1C1C22]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 transition-all duration-300">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="search"
                        placeholder="Rechercher un projet..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Rechercher un projet"
                        className="w-full bg-white/5 border border-white/5 text-white text-sm rounded-full pl-9 pr-4 py-2.5 outline-none focus:border-lime-400/50 transition-colors placeholder:text-white/30"
                      />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                      {[
                        { id: 'all', label: t('filter.status.all') },
                        { id: 'active', label: t('filter.status.active') },
                        { id: 'completed', label: 'Financés' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleStatusChange(option.id)}
                          className={`px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors ${
                            status === option.id
                              ? 'bg-lime-400 text-[#0B0F15] font-bold'
                              : 'bg-white/5 text-white/60 hover:text-white font-medium'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>,
                portalRoot,
              )
            : null}
        </>
      )}

      {/* Main Content Area — extra bottom padding on mobile for the floating search bar */}
      <div
        className={`w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pt-8 ${shouldShowFloatingFilters ? 'pb-48' : 'pb-32'} md:pb-16 lg:pt-10`}
      >
        {normalizedProjects.length > 0 && (
          <div className="mb-6 flex items-center justify-end">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => handleViewChange('grid')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  view === 'grid'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-white/10'
                }`}
                aria-pressed={view === 'grid'}
                aria-label="Vue grille"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grille</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('list')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  view === 'list'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-white/10'
                }`}
                aria-pressed={view === 'list'}
                aria-label="Vue liste"
              >
                <List className="h-3.5 w-3.5" />
                <span>Liste</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('map')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  view === 'map'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-white/10'
                }`}
                aria-pressed={view === 'map'}
                aria-label="Vue carte"
              >
                <Map className="h-3.5 w-3.5" />
                <span>Carte</span>
              </button>
            </div>
          </div>
        )}

        {normalizedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-2xl font-bold mb-2">{t('empty')}</h2>
            <p className="text-muted-foreground max-w-md">{t('filter.empty_description')}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setStatus('all')
                setView('grid')
                updateFilters('', 'all', 'grid')
              }}
              className="mt-6"
            >
              {t('filter.reset_filters')}
            </Button>
          </div>
        ) : view === 'map' ? (
          <ProjectsGoogleMapView projects={normalizedProjects} />
        ) : view === 'list' ? (
          <div className="-mx-4 md:-mx-8 lg:-mx-12">
            {normalizedProjects.map((project, index) => {
              const currentFunding = project.current_funding ?? 0
              const targetBudget = project.target_budget ?? 0
              const progressPercent =
                project.funding_progress !== null && project.funding_progress !== undefined
                  ? project.funding_progress
                  : targetBudget > 0
                    ? (currentFunding / targetBudget) * 100
                    : 0
              const clampedProgress = Math.min(Math.max(progressPercent, 0), 100)
              const imageUrl = sanitizeImageUrl(project.hero_image_url)
              const isLast = index === normalizedProjects.length - 1

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-transparent active:bg-white/5 transition-colors text-left group"
                >
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/5">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={project.name_default}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                  </div>

                  <div
                    className={`flex-1 min-w-0 flex flex-col justify-center ${isLast ? '' : 'border-b border-white/10 pb-4'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white truncate">
                        {project.name_default}
                      </h3>
                      {project.featured ? (
                        <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      ) : null}
                    </div>
                    <p className="text-xs text-white/50 truncate mb-3">
                      {project.description_default || ''}
                    </p>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-sm font-black text-lime-400 tabular-nums">
                        {formatEuroAmount(currentFunding)}
                      </span>
                      <span className="text-[10px] font-medium text-white/40 uppercase tabular-nums">
                        / {formatEuroAmount(targetBudget)} Obj.
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="bg-lime-400 h-full rounded-full"
                        style={{ width: `${clampedProgress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {normalizedProjects.map((project) => (
              <ClientCatalogProjectCard
                key={project.id}
                project={project}
                labels={{
                  viewLabel: t('filter.cta'),
                  progressLabel: t('filter.progress.label'),
                  fundedLabel: t('filter.progress.collected'),
                  goalLabel: t('filter.progress.goal'),
                  featuredLabel: t('filter.featured'),
                  activeLabel: t('filter.status.active'),
                }}
              />
            ))}
          </div>
        )}

        {isPending && (
          <p className="text-xs text-muted-foreground animate-pulse" aria-live="polite">
            Chargement...
          </p>
        )}
      </div>
    </>
  )
}
