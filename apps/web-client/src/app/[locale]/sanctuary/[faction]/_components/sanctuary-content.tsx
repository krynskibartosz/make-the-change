'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SanctuaryContentProps {
  factionConfig: {
    name: string
    title: string
    mascot: string
    emoji: string
  }
  theme: {
    accentText: string
    accentBg: string
    accentBorder: string
  }
  contribution: {
    contributionShare: number
  } | null
  isLeading: boolean
  biodexData: {
    unlockedSpecies: Array<{ id: string; name: string; image: string; rarity: string; isUnlocked: boolean }>
    lockedSpecies: Array<{ id: string; name: string; image: string; rarity: string; isUnlocked: boolean }>
  }
}

// Rareté styles
const RARITY_STYLES: Record<string, { badge: string }> = {
  'Commun': {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  'Rare': {
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  },
  'Légendaire': {
    badge: 'bg-amber-400/15 text-amber-400 border-amber-400/20',
  },
}

export function SanctuaryContent({ 
  factionConfig, 
  theme, 
  contribution, 
  isLeading,
  biodexData 
}: SanctuaryContentProps) {
  return (
    <div className="relative z-10 -mt-20 bg-[#0B0F15] rounded-t-[3rem] border-t border-white/10 px-5 pb-32 pt-12 sm:px-6">
      {/* Monumental Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-12 space-y-12"
      >
        <h2 className="text-2xl font-black text-white">Impact Collectif</h2>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-5xl font-black text-white mb-2">1.2M</p>
            <p className="text-sm text-white/50">Abeilles protégées</p>
          </div>
          
          <div className="text-center">
            <p className="text-5xl font-black text-white mb-2">450</p>
            <p className="text-sm text-white/50">Ruches financées</p>
          </div>
          
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              {/* Progress Ring */}
              <svg className="h-24 w-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(contribution?.contributionShare || 0) * 2.51} 251`}
                  strokeLinecap="round"
                  className={theme.accentText}
                />
              </svg>
              <div className="absolute">
                <p className={`text-3xl font-black ${theme.accentText}`}>{contribution?.contributionShare || 0}%</p>
              </div>
            </div>
            <p className="text-sm text-white/50 mt-2">De l'effort total porté par {factionConfig.name}</p>
            {isLeading && (
              <span className={`inline-block mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ${theme.accentText}`}>
                Leader !
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Biodex Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">Galerie du Biodex</h2>
          <Link href="/biodex" className="text-sm font-semibold text-white/60 hover:text-white">
            Voir tout →
          </Link>
        </div>
        
        <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto px-0 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[...biodexData.unlockedSpecies, ...biodexData.lockedSpecies].map((species) => {
            const rarityStyle = RARITY_STYLES[species.rarity] || RARITY_STYLES['Commun']
            
            return (
              <Link
                key={species.id}
                href={species.isUnlocked ? `/biodex/${species.id}` : "/onboarding/step-0"}
                className={cn(
                  'relative flex aspect-[4/5] w-40 shrink-0 snap-center flex-col overflow-hidden rounded-3xl border p-3 transition-transform duration-150 active:scale-[0.97]',
                  species.isUnlocked ? 'bg-background/50 border-white/5' : 'bg-white/5 border-white/5'
                )}
              >
                {/* Top row: rarity badge OR lock icon */}
                <div className="flex justify-end shrink-0 mb-2">
                  {!species.isUnlocked ? (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/5 border border-white/10">
                      <Lock className="h-3 w-3 text-white/30" />
                    </div>
                  ) : (
                    <span
                      className={cn(
                        'text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 border',
                        rarityStyle.badge
                      )}
                    >
                      {species.rarity}
                    </span>
                  )}
                </div>

                {/* Middle: visual area */}
                <div
                  className={cn(
                    'flex-1 rounded-2xl overflow-hidden relative flex items-center justify-center',
                    !species.isUnlocked && 'bg-white/5 border border-white/5'
                  )}
                >
                  <img
                    src={species.image}
                    alt={species.name}
                    className={cn(
                      'h-full w-full object-cover transition-all duration-700',
                      !species.isUnlocked && 'scale-105 grayscale contrast-125 opacity-40 blur-[2px]'
                    )}
                  />
                </div>

                {/* Bottom: species name */}
                <div className="shrink-0 mt-2">
                  <p
                    className={cn(
                      'text-sm font-semibold truncate leading-tight',
                      !species.isUnlocked ? 'text-white/60' : 'text-white/90'
                    )}
                  >
                    {species.name}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Social Recognition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h2 className="text-2xl font-black text-white mb-6">Les Héros de la Semaine</h2>
        
        <div className="flex gap-6">
          {[
            { name: 'Thomas M.', impact: '4500 graines', avatar: 'https://i.pravatar.cc/80?u=thomas-m' },
            { name: 'Sarah L.', impact: '4200 graines', avatar: 'https://i.pravatar.cc/80?u=sarah-l' },
            { name: 'Lucas D.', impact: '3800 graines', avatar: 'https://i.pravatar.cc/80?u=lucas-d' },
          ].map((hero, i) => {
            // Define halo colors for ranks
            const haloColors = [
              'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]', // Gold
              'border-slate-300/50 shadow-[0_0_20px_rgba(203,213,225,0.3)]', // Silver
              'border-amber-700/50 shadow-[0_0_20px_rgba(180,83,9,0.3)]', // Bronze
            ]
            
            return (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="relative mb-3">
                  <div className={`h-20 w-20 rounded-full border-3 p-1 ${haloColors[i] || haloColors[2]}`}>
                    <img
                      src={hero.avatar}
                      alt={hero.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">{hero.name}</p>
                <p className="text-xs text-white/40">{hero.impact}</p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
