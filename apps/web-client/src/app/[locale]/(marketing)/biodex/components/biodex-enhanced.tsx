'use client'

import { Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { SpeciesCardEnhanced } from './species-card-enhanced'
import type { SpeciesContext } from '@/types/context'

interface BiodexEnhancedProps {
  species: SpeciesContext[]
}

export function BiodexEnhanced({ species }: BiodexEnhancedProps) {
  const t = useTranslations('marketing_pages.biodex')

  // Tri automatique : Unlocked → Locked (pas de filtres manuels)
  const sortedSpecies = useMemo(() => {
    return [...species].sort((a, b) => {
      const aUnlocked = a.user_status?.isUnlocked ?? false
      const bUnlocked = b.user_status?.isUnlocked ?? false
      
      // 1. Débloquées en premier
      if (aUnlocked && !bUnlocked) return -1
      if (!aUnlocked && bUnlocked) return 1

      // 2. Puis alphabétique
      return a.name_default.localeCompare(b.name_default, 'fr')
    })
  }, [species])

  return (
    <>
      {/* Hero Section : Progression Collection (épuré, respire) */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-white/5 pt-[max(env(safe-area-inset-top),1rem)] pb-4">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-br from-lime-500/10 to-emerald-600/10 border border-lime-500/20 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  Mon BioDex
                </h2>
                <p className="text-sm text-white/60 font-medium">
                  Espèces sauvées grâce à vos dons
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-lime-400 tabular-nums">
                  {sortedSpecies.filter((s) => s.user_status?.isUnlocked).length}
                  <span className="text-white/40 text-lg">/{species.length}</span>
                </p>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">
                  Débloquées
                </p>
              </div>
            </div>

            {/* Barre de progression visuelle */}
            <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(132,204,22,0.4)]"
                style={{
                  width: `${
                    species.length > 0
                      ? (sortedSpecies.filter((s) => s.user_status?.isUnlocked).length /
                          species.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* Percentage */}
            <p className="text-xs text-white/50 font-bold text-center mt-2 tabular-nums">
              {species.length > 0
                ? Math.round(
                    (sortedSpecies.filter((s) => s.user_status?.isUnlocked).length /
                      species.length) *
                      100,
                  )
                : 0}
              % complété
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area : Cards Espèces (tri automatique) */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-32 pt-6">
        {sortedSpecies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedSpecies.map((item) => (
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
                  {t('empty_title')}
                </p>
                <p className="mx-auto max-w-xs font-medium text-muted-foreground">
                  {t('empty_description')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
