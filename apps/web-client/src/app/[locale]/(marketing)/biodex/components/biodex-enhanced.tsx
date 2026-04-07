'use client'

import { Input } from '@make-the-change/core/ui'
import { Leaf, Search, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { SpeciesCardEnhanced } from './species-card-enhanced'
import { BadgesCarousel } from './badges-carousel'
import type { SpeciesContext } from '@/types/context'
import { cn } from '@/lib/utils'

const ALL_STATUSES = ['NE', 'DD', 'LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'] as const
const CONSERVATION_STATUSES: ReadonlySet<string> = new Set(ALL_STATUSES)

const isConservationStatus = (value: string): boolean => {
  return CONSERVATION_STATUSES.has(value)
}

interface BiodexEnhancedProps {
  species: SpeciesContext[]
}

export function BiodexEnhanced({ species }: BiodexEnhancedProps) {
  const t = useTranslations('marketing_pages.biodex')
  const locale = useLocale()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | string>('all')

  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>()
    for (const item of species) {
      if (item.conservation_status && isConservationStatus(item.conservation_status)) {
        statuses.add(item.conservation_status)
      }
    }
    return Array.from(statuses)
  }, [species])

  // Rareté helper pour tri
  const getRarity = (status: string | null | undefined): 'common' | 'rare' | 'legendary' => {
    switch (status?.toUpperCase()) {
      case 'EN':
      case 'CR':
      case 'EW':
      case 'EX':
        return 'legendary'
      case 'VU':
      case 'NT':
        return 'rare'
      default:
        return 'common'
    }
  }

  const filteredSpecies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    // Filtrage
    const filtered = species.filter((item) => {
      if (status !== 'all' && item.conservation_status !== status) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const name = item.name_default
      const description = item.description_default
      const scientificName = item.scientific_name || ''

      const haystack = [name, scientificName, description]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })

    // Tri intelligent iOS 26.4 : débloquées récentes → rareté → alphabétique
    return filtered.sort((a, b) => {
      // 1. Débloquées d'abord (dopamine boost)
      const aUnlocked = a.user_status?.isUnlocked ?? false
      const bUnlocked = b.user_status?.isUnlocked ?? false
      
      if (aUnlocked && !bUnlocked) return -1
      if (!aUnlocked && bUnlocked) return 1

      // 2. Puis par rareté (legendary > rare > common)
      const rarityOrder = { legendary: 0, rare: 1, common: 2 }
      const aRarity = getRarity(a.conservation_status)
      const bRarity = getRarity(b.conservation_status)
      const rarityDiff = rarityOrder[aRarity] - rarityOrder[bRarity]
      
      if (rarityDiff !== 0) return rarityDiff

      // 3. Puis alphabétique
      return a.name_default.localeCompare(b.name_default, 'fr')
    })
  }, [search, species, status])

  return (
    <>
      {/* Search and Filters Bar */}
      <div className="sticky top-[calc(52px_+_env(safe-area-inset-top))] sm:top-[56px] z-30 border-b border-white/5 bg-background/95 backdrop-blur pb-2">
        <div className="w-full max-w-7xl mx-auto">
          {species.length > 20 && (
            <div className="mb-4">
              <search role="search" className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="🔍 Rechercher dans le BioDex..."
                  className="pl-9 h-10 bg-background/50 w-full"
                />
              </search>
            </div>
          )}

          {/* Chip Filters — horizontal scrollable */}
          <div className="flex gap-2 overflow-x-auto mt-4 pb-1 scrollbar-hide -mx-1 px-1">
            {/* "Toutes" chip */}
            <button
              onClick={() => setStatus('all')}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 whitespace-nowrap active:scale-95',
                status === 'all'
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/20'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors',
              )}
            >
              Toutes
            </button>

            {availableStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95',
                  status === s
                    ? 'bg-lime-500/15 text-lime-400 border border-lime-500/20 font-bold'
                    : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors',
                )}
              >
                {t(`status.${s}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Carousel iOS 26.4 — sticky, positioned after filters */}
      <div className="sticky z-20" style={{ top: 'calc(52px + env(safe-area-inset-top) + 140px)' }}>
        <BadgesCarousel />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto pb-24 pt-6">
        {filteredSpecies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSpecies.map((item) => (
              <SpeciesCardEnhanced key={item.id} species={item} />
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
