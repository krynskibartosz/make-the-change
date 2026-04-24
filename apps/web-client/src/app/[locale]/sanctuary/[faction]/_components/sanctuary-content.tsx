'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'

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
  factionMessage: string
  contribution: {
    contributionShare: number
  } | null
  isLeading: boolean
}

export function SanctuaryContent({ 
  factionConfig, 
  theme, 
  factionMessage, 
  contribution, 
  isLeading 
}: SanctuaryContentProps) {
  return (
    <div className="relative z-10 -mt-20 bg-[#0B0F15] rounded-t-[3rem] border-t border-white/10 px-5 pb-32 pt-12 sm:px-6">
      {/* Dynamic Faction Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${theme.accentBg}`}>
            <span className="text-2xl">{factionConfig.emoji}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-2">Message de {factionConfig.name}</p>
            <p className="text-base text-white/80 leading-relaxed">{factionMessage}</p>
          </div>
        </div>
      </motion.div>

      {/* Monumental Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-12 space-y-6"
      >
        <h2 className="text-2xl font-black text-white">Impact Collectif</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-4xl font-black text-white mb-2">1.2M</p>
            <p className="text-sm text-white/60">Abeilles protégées</p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-4xl font-black text-white mb-2">450</p>
            <p className="text-sm text-white/60">Ruches financées</p>
          </div>
          
          <div className={`rounded-2xl border ${theme.accentBorder} ${theme.accentBg} p-6`}>
            <p className={`text-4xl font-black ${theme.accentText} mb-2`}>{contribution?.contributionShare || 0}%</p>
            <p className="text-sm text-white/60">Part de la récolte</p>
            {isLeading && (
              <span className="inline-block mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
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
        
        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 mb-3 flex items-center justify-center">
                <span className="text-4xl opacity-30">🦋</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">Espèce {i}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Social Recognition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h2 className="text-2xl font-black text-white mb-6">Les Héros de la Semaine</h2>
        
        <div className="flex gap-4">
          {[
            { name: 'Thomas M.', impact: '4500 graines', avatar: 'https://i.pravatar.cc/80?u=thomas-m' },
            { name: 'Sarah L.', impact: '4200 graines', avatar: 'https://i.pravatar.cc/80?u=sarah-l' },
            { name: 'Lucas D.', impact: '3800 graines', avatar: 'https://i.pravatar.cc/80?u=lucas-d' },
          ].map((hero, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="relative mb-3">
                <div className={`h-16 w-16 rounded-full border-2 ${theme.accentBorder} p-0.5`}>
                  <img
                    src={hero.avatar}
                    alt={hero.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${theme.accentBg} text-[10px] font-bold`}>
                  #{i + 1}
                </div>
              </div>
              <p className="text-sm font-semibold text-white">{hero.name}</p>
              <p className="text-xs text-white/60">{hero.impact}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
