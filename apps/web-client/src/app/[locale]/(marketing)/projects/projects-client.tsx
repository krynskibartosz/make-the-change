'use client'

import { Button, Input } from '@make-the-change/core/ui'
import { Search, Target } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  type ClientCatalogProject,
  ClientCatalogProjectCard,
} from '@/app/[locale]/(marketing)/projects/components/client-catalog-project-card'

type RawClientProject = {
  id: string | null
  slug: string | null
  name_default: string | null
  description_default: string | null
  target_budget: number | null
  current_funding: number | null
  funding_progress: number | null
  address_city: string | null
  address_country_code: string | null
  featured: boolean | null
  launch_date: string | null
  status: string | null
  hero_image_url: string | null
  type: string | null
  producer?: { name_default?: string | null } | Record<string, unknown> | null
}

interface ProjectsClientProps {
  projects: RawClientProject[]
  initialStatus: string
  initialSearch: string
}

const normalizeProject = (
  project: RawClientProject,
  index: number,
  fallbackName: string,
): ClientCatalogProject => {
  const id = project.id || project.slug || `project-${index}`
  const producer =
    project.producer && typeof project.producer === 'object' && 'name_default' in project.producer
      ? { name_default: project.producer.name_default as string | null | undefined }
      : undefined

  return {
    id,
    slug: project.slug || id,
    name_default: project.name_default || fallbackName,
    description_default: project.description_default,
    target_budget: project.target_budget,
    current_funding: project.current_funding,
    funding_progress: project.funding_progress,
    address_city: project.address_city,
    address_country_code: project.address_country_code,
    featured: project.featured,
    status: project.status,
    hero_image_url: project.hero_image_url,
    type: project.type,
    producer,
  }
}

export function ProjectsClient({ projects, initialStatus, initialSearch }: ProjectsClientProps) {
  const t = useTranslations('projects')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)

  const updateFilters = useCallback(
    (newSearch: string, newStatus: string) => {
      const params = new URLSearchParams()
      if (newSearch) params.set('search', newSearch)
      if (newStatus && newStatus !== 'all') params.set('status', newStatus)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateFilters(search, status)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, initialSearch, status, updateFilters])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    updateFilters(search, newStatus)
  }

  const normalizedProjects = projects.map((project, index) =>
    normalizeProject(project, index, t('card.view_details')),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl shadow-sm border">
        <search role="search" className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder={t('filter.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label={t('filter.search_placeholder')}
          />
        </search>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: t('filter.status.all') },
            { id: 'active', label: t('filter.status.active') },
            { id: 'completed', label: t('filter.status.completed') },
          ].map((option) => (
            <Button
              key={option.id}
              variant={status === option.id ? 'default' : 'outline'}
              onClick={() => handleStatusChange(option.id)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

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
              updateFilters('', 'all')
            }}
            className="mt-6"
          >
            {t('filter.reset_filters')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  )
}
