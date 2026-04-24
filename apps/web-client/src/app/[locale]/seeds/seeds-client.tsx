'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Sprout, Zap, BookOpen, PawPrint, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpeciesEvolution {
  id: string
  name: string
  currentStage: string
  nextStage: string
  currentSeeds: number
  requiredSeeds: number
  icon: string
  category: string
}

interface SeedsClientProps {
  balance: number
  transactions: Array<{
    id: string
    label: string
    delta: number
    createdAt: string
  }>
}

// Mock data pour les évolutions disponibles
const MOCK_EVOLUTIONS: SpeciesEvolution[] = [
  {
    id: 'lynx',
    name: 'Lynx',
    currentStage: 'Lynceau',
    nextStage: 'Lynx Adulte',
    currentSeeds: 1200,
    requiredSeeds: 1500,
    icon: '🐱',
    category: 'Mammifère'
  },
  {
    id: 'owl',
    name: 'Hibou',
    currentStage: 'Poussin',
    nextStage: 'Hibou Grand-Duc',
    currentSeeds: 800,
    requiredSeeds: 1200,
    icon: '🦉',
    category: 'Oiseau'
  },
  {
    id: 'butterfly',
    name: 'Papillon Monarque',
    currentStage: 'Chenille',
    nextStage: 'Papillon',
    currentSeeds: 450,
    requiredSeeds: 800,
    icon: '🦋',
    category: 'Insecte'
  }
]

export default function SeedsClient({ balance, transactions }: SeedsClientProps) {

  return (
    <div className="min-h-screen bg-[#0B0F15]">
      {/* Header with back button - Style like eco-fact/daily-harvest */}
      <div className="sticky top-0 z-50 bg-[#0B0F15]/80 backdrop-blur-md border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link
            href="/aventure?tab=defis"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <div className="flex items-center gap-2 relative">
            <div className="absolute inset-0 bg-amber-500/12 blur-[60px]" />
            <Sprout className="w-5 h-5 text-amber-400 relative z-10" />
            <span className="text-lg font-bold text-white tabular-nums relative z-10">{balance.toLocaleString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-5 pb-32 pt-24 sm:px-6">
        
        {/* Quick Earn - Besoin de graines ? */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">Besoin de graines ?</h2>
          <div className="space-y-3">
            <Link
              href="/aventure/immersive/daily-harvest/today"
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Récolte quotidienne</h3>
                    <p className="text-xs text-white/40">Action immédiate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+150</span>
                  <Sprout className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </Link>
            <Link
              href="/aventure/immersive/eco-fact/today"
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Éco-Fact du jour</h3>
                    <p className="text-xs text-white/40">Apprends & gagne</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+50</span>
                  <Sprout className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Évolutions disponibles - BioDex Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">Évolutions disponibles</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {MOCK_EVOLUTIONS.map((evolution, index) => {
              const progress = (evolution.currentSeeds / evolution.requiredSeeds) * 100
              const canAfford = balance >= (evolution.requiredSeeds - evolution.currentSeeds)
              
              return (
                <Link
                  key={evolution.id}
                  href="/biodex"
                  className="flex-shrink-0 w-48 snap-start"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                    className="relative flex flex-col p-4 aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.97] hover:border-amber-500/30"
                  >
                    {/* Emoji silhouette */}
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-6xl">{evolution.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">{evolution.name}</h3>
                        <p className="text-xs text-white/40">{evolution.currentStage} → {evolution.nextStage}</p>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">
                            {evolution.currentSeeds}/{evolution.requiredSeeds} <Sprout className="inline w-3 h-3" />
                          </span>
                          {canAfford ? (
                            <span className="text-amber-400 font-semibold">Évoluer</span>
                          ) : (
                            <span className="text-white/30">+</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.section>

        {/* History - Apple Wallet Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Mon carnet de route</h2>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.03), duration: 0.3 }}
                className="flex items-center justify-between py-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-sm">{transaction.label}</p>
                    <span className={cn(
                      'font-bold text-sm tabular-nums ml-4',
                      transaction.delta > 0 ? 'text-amber-400' : 'text-white/40'
                    )}>
                      {transaction.delta > 0 ? '+' : ''}{transaction.delta} <Sprout className="inline h-4 w-4 align-text-bottom" />
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">
                    Il y a {Math.floor((Date.now() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60))}h
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
