'use client'

import { cn } from '@/lib/utils'

interface Badge {
  id: string
  name: string
  icon: string
  unlocked: boolean
  description?: string
}

interface BadgesCarouselProps {
  badges?: Badge[]
}

// Mock badges pour l'instant (à remplacer par vraies données plus tard)
const DEFAULT_BADGES: Badge[] = [
  { id: '1', name: 'Gardien des Forêts', icon: '🌲', unlocked: true, description: 'Soutenez 3 projets forestiers' },
  { id: '2', name: 'Ami des Abeilles', icon: '🐝', unlocked: true, description: 'Débloquez 5 espèces pollinisateurs' },
  { id: '3', name: 'Observateur', icon: '🦅', unlocked: true, description: 'Explorez 10 fiches espèces' },
  { id: '4', name: 'Protecteur', icon: '🛡️', unlocked: false, description: 'Complétez 5 défis environnementaux' },
  { id: '5', name: 'Explorateur', icon: '🔍', unlocked: false, description: 'Découvrez toutes les espèces' },
  { id: '6', name: 'Botaniste', icon: '🌿', unlocked: false, description: 'Maîtrisez la catégorie Flore' },
]

export function BadgesCarousel({ badges = DEFAULT_BADGES }: BadgesCarouselProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length
  const totalCount = badges.length

  // Ne pas afficher si moins de 1 badge débloqué
  if (unlockedCount === 0) {
    return null
  }

  return (
    <div className="w-full border-b border-white/5 bg-background/95 backdrop-blur-xl pb-4 pt-2">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header avec compteur */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white/90">🏆 Mes Badges</h3>
          <span className="text-xs font-medium text-white/50 tabular-nums">
            {unlockedCount} / {totalCount}
          </span>
        </div>

        {/* Carousel horizontal iOS-style avec snap points */}
        <div className="relative -mx-1">
          <div 
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 px-1"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'snap-start shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 active:scale-95',
                  badge.unlocked
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white/[0.02] border-white/5 opacity-60',
                )}
                style={{
                  minWidth: '88px',
                  maxWidth: '88px',
                }}
              >
                {/* Icône badge */}
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full transition-all duration-300',
                    badge.unlocked
                      ? 'bg-gradient-to-br from-lime-500/20 to-lime-600/10 shadow-[0_0_16px_rgba(132,204,22,0.15)]'
                      : 'bg-white/5 grayscale',
                  )}
                  style={{
                    width: '52px',
                    height: '52px',
                  }}
                >
                  <span 
                    className="text-2xl leading-none"
                    style={{
                      filter: badge.unlocked ? 'none' : 'grayscale(100%) brightness(0.5)',
                    }}
                  >
                    {badge.icon}
                  </span>
                </div>

                {/* Nom badge */}
                <p
                  className={cn(
                    'text-[10px] font-semibold text-center leading-tight line-clamp-2',
                    badge.unlocked ? 'text-white/90' : 'text-white/40',
                  )}
                >
                  {badge.name}
                </p>

                {/* Indicator débloqué (checkmark) */}
                {badge.unlocked && (
                  <div className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full bg-lime-500 shadow-sm">
                    <svg
                      className="w-2.5 h-2.5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {/* CTA "Voir tous les badges" si plus de 6 badges */}
            {badges.length > 6 && (
              <div
                className="snap-start shrink-0 flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border border-white/10 bg-gradient-to-br from-lime-500/10 to-lime-600/5 hover:from-lime-500/15 hover:to-lime-600/10 transition-all duration-200 active:scale-95 cursor-pointer"
                style={{
                  minWidth: '88px',
                  maxWidth: '88px',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full bg-lime-500/20"
                  style={{
                    width: '52px',
                    height: '52px',
                  }}
                >
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-[10px] font-semibold text-center leading-tight text-lime-400">
                  Voir tous
                </p>
              </div>
            )}
          </div>

          {/* Gradient fade indicators (iOS style) */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
