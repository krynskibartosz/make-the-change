'use client'

import type { Project } from '@make-the-change/core/schema'
import {
  Badge,
  BottomSheet,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
  DataCard,
  DataList,
  Input,
  Progress,
} from '@make-the-change/core/ui'
import { MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { getRandomProjectImage } from '@/lib/placeholder-images'
import { cn, formatPoints } from '@/lib/utils'

interface ProjectsClientProps {
  projects: Project[]
  initialStatus: string
  initialSearch: string
}

const statusFilters = ['all', 'active', 'completed'] as const

export function ProjectsClient({ projects, initialStatus, initialSearch }: ProjectsClientProps) {
  const t = useTranslations('projects')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateFilters = (newStatus: string, newSearch: string) => {
    const params = new URLSearchParams()
    if (newStatus !== 'all') params.set('status', newStatus)
    if (newSearch) params.set('search', newSearch)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    updateFilters(newStatus, search)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(status, search)
  }

  // Helper to get location display string
  const getLocationDisplay = (project: Project): string | null => {
    const parts = [project.address_city, project.address_country_code].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : null
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        {/* Mobile: search + filters sheet */}
        <div className="space-y-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('filter.search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <BottomSheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <BottomSheetTrigger
                aria-label="Ouvrir les filtres"
                disabled={isPending}
                render={
                  <Button type="button" variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                }
              />
              <BottomSheetContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Filtres</p>
                    {status !== 'all' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleStatusChange('all')
                          setFiltersOpen(false)
                        }}
                      >
                        Réinitialiser
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {statusFilters.map((filterStatus) => (
                      <button
                        key={filterStatus}
                        type="button"
                        onClick={() => {
                          handleStatusChange(filterStatus)
                          setFiltersOpen(false)
                        }}
                        className={cn(
                          'rounded-2xl border bg-card px-4 py-3 text-left text-sm font-semibold transition',
                          status === filterStatus ? 'ring-2 ring-primary/30' : 'hover:bg-muted/30',
                        )}
                      >
                        {t(`filter.${filterStatus}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </BottomSheetContent>
            </BottomSheet>
          </form>

          {status !== 'all' ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {t(`filter.${status}`)}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Effacer le filtre"
                onClick={() => handleStatusChange('all')}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Desktop: tabs + search button */}
        <div className="hidden flex-col gap-4 md:flex md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {statusFilters.map((filterStatus) => (
              <Button
                key={filterStatus}
                variant={status === filterStatus ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(filterStatus)}
                disabled={isPending}
              >
                {t(`filter.${filterStatus}`)}
              </Button>
            ))}
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
          >
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('filter.search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {t('filter.all') === 'Tous' ? 'Rechercher' : 'Search'}
            </Button>
          </form>
        </div>
      </div>

      {/* Projects Grid */}
      {/* Projects Grid */}
      <div
        className={cn(
          'transition-opacity duration-200',
          isPending && 'opacity-50 pointer-events-none',
        )}
      >
        <DataList
          items={projects}
          gridCols={3}
          emptyState={{
            title: t('empty'),
            icon: Search,
          }}
          renderItem={(project) => {
            const fundingProgress = project.target_budget
              ? ((project.current_funding || 0) / project.target_budget) * 100
              : 0
            const location = getLocationDisplay(project)
            const metadata = project.metadata as Record<string, unknown> | null
            const imageUrl =
              (project.hero_image_url as string | undefined) ||
              (metadata?.image_url as string | undefined) ||
              (metadata?.images as string[] | undefined)?.[0] ||
              getRandomProjectImage(project.name_default?.length || 0)

            return (
              <DataCard
                LinkComponent={Link}
                href={`/projects/${project.slug}`}
                image={imageUrl}
                imageAlt={project.name_default || ''}
                className="h-full"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{project.name_default}</h3>
                  <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                    {project.status === 'active' ? 'Actif' : 'Terminé'}
                  </Badge>
                </div>
                {location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </div>
                )}
                {project.description_default && (
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {project.description_default}
                  </p>
                )}
                {project.target_budget && (
                  <div className="space-y-2 mt-auto">
                    <Progress value={fundingProgress} />
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {Math.round(fundingProgress)}% {t('card.funded')}
                      </span>
                      <span className="text-muted-foreground">
                        {t('card.goal')}: {formatPoints(project.target_budget)}€
                      </span>
                    </div>
                  </div>
                )}
              </DataCard>
            )
          }}
        />
      </div>
    </>
  )
}
