'use client'

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@make-the-change/core/ui'
import { Filter, Leaf, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { SpeciesCard } from '@/app/[locale]/(marketing)/biodex/_features/species-card'
import type { ConservationStatus, Species } from '@/app/[locale]/(marketing)/biodex/_features/types'
import { getLocalizedContent } from '@/app/[locale]/(marketing)/biodex/_features/utils'

const ALL_STATUSES = ['NE', 'DD', 'LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'] as const

const isConservationStatus = (value: string): value is ConservationStatus => {
  return ALL_STATUSES.includes(value as ConservationStatus)
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
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          {t('results_count', { shown: filteredSpecies.length, total: species.length })}
        </p>
      </div>

      <div className="mb-12 flex flex-col items-center gap-4 rounded-3xl border bg-background/80 p-4 shadow-2xl backdrop-blur-xl md:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('search_placeholder')}
            className="h-14 rounded-2xl border-none bg-muted/50 pl-12 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="inline-flex h-14 items-center gap-2 rounded-2xl bg-muted/50 px-4 text-sm font-bold text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{t('filters.label')}</span>
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              if (!value) {
                return
              }

              if (value === 'all' || isConservationStatus(value)) {
                setStatus(value)
              }
            }}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-none bg-primary px-5 text-left text-[10px] font-black uppercase tracking-widest text-marketing-overlay-light shadow-lg shadow-primary/20 md:w-56">
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

      {filteredSpecies.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </>
  )
}
