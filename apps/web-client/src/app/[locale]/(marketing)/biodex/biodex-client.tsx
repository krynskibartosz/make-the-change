'use client'

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@make-the-change/core/ui'
import { Filter, Leaf, Search, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { SpeciesCard } from '@/app/[locale]/(marketing)/biodex/_features/species-card'
import type { ConservationStatus, Species } from '@/app/[locale]/(marketing)/biodex/_features/types'
import { getLocalizedContent } from '@/app/[locale]/(marketing)/biodex/_features/utils'

const ALL_STATUSES = ['NE', 'DD', 'LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'] as const
const CONSERVATION_STATUSES: ReadonlySet<string> = new Set(ALL_STATUSES)

const isConservationStatus = (value: string): value is ConservationStatus => {
  return CONSERVATION_STATUSES.has(value)
}

interface BiodexClientProps {
  species: Species[]
}

export function BiodexClient({ species }: BiodexClientProps) {
  const t = useTranslations('marketing_pages.biodex')
  const locale = useLocale()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | ConservationStatus>('all')

  const availableStatuses = useMemo(() => {
    const statuses = new Set<ConservationStatus>()
    for (const item of species) {
      if (item.conservation_status && isConservationStatus(item.conservation_status)) {
        statuses.add(item.conservation_status)
      }
    }
    return Array.from(statuses)
  }, [species])

  const filteredSpecies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return species.filter((item) => {
      if (status !== 'all' && item.conservation_status !== status) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const name = getLocalizedContent(item.name_i18n, locale, '')
      const description = getLocalizedContent(item.description_i18n, locale, '')
      const family =
        item.content_levels && typeof item.content_levels.family === 'string'
          ? item.content_levels.family
          : ''

      const haystack = [name, item.scientific_name || '', family, description]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [locale, search, species, status])

  return (
    <>
      {/* Page Hero Section */}
      <div className="relative py-8 md:pb-12 md:pt-24 overflow-hidden">
        <div className="absolute left-0 top-0 -z-10 h-full w-full opacity-20">
          <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-marketing-positive-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[30%] w-[30%] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center">
            <span className="mb-6 animate-fade-in flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3 animate-pulse text-primary" />
              {t('badge')}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Fixed Search and Filters Bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full lg:w-auto lg:gap-4">
              <search role="search" className="relative w-full lg:w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('search_placeholder')}
                  className="pl-9 h-10 bg-background w-full"
                />
              </search>
            </div>

            {/* Status Filters */}
            <div className="flex w-full items-center justify-between gap-4 lg:w-auto">
              <p className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:block">
                {t('results_count', { shown: filteredSpecies.length, total: species.length })}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="inline-flex h-10 items-center gap-2 rounded-md bg-muted/50 px-3 text-sm font-medium text-muted-foreground shrink-0 hidden sm:flex">
                  <Filter className="h-4 w-4" />
                  <span>{t('filters.label')}</span>
                </div>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    if (!value) return
                    if (value === 'all' || isConservationStatus(value)) setStatus(value)
                  }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-56 bg-background">
                    <SelectValue placeholder={t('filters.all_statuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.all_statuses')}</SelectItem>
                    {availableStatuses.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`status.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pb-24 pt-8 lg:pb-16 lg:pt-10">
        {filteredSpecies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSpecies.map((item) => (
              <SpeciesCard key={item.id} species={item} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                <Leaf className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black tracking-tight">
                  {species.length === 0 ? t('empty_title') : t('empty_filtered_title')}
                </p>
                <p className="mx-auto max-w-xs font-medium text-muted-foreground">
                  {species.length === 0 ? t('empty_description') : t('empty_filtered_description')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
