'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Sprout, TrendingUp, Award, Zap, Crown, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SeedsClientProps {
  balance: number
  transactions: Array<{
    id: string
    label: string
    delta: number
    createdAt: string
  }>
  subscription: {
    plan_type: string
    current_period_end: string
    monthly_points_allocation: number
  } | null
  currentDayKey: string
}

// Mock achievements with poetic tone
const MOCK_ACHIEVEMENTS = [
  { id: 'first-harvest', name: 'Première Pousse', emoji: '🌱', description: 'Ta première graine gagnée', unlocked: true, progress: 100, target: 1 },
  { id: 'beekeeper', name: 'Gardien du Rucher', emoji: '🐝', description: '1000 graines des défis quotidiens', unlocked: true, progress: 100, target: 1000 },
  { id: 'forest-walker', name: 'Marcheur des Forêts', emoji: '🌲', description: '5000 graines au total', unlocked: false, progress: 3450, target: 5000 },
  { id: 'ocean-seeds', name: 'Océan de Graines', emoji: '🌊', description: '10 000 graines atteintes', unlocked: false, progress: 3450, target: 10000 },
]

// Mock weekly analytics data (last 7 days)
const MOCK_WEEKLY_DATA = [
  { day: 'Lun', seeds: 120 },
  { day: 'Mar', seeds: 85 },
  { day: 'Mer', seeds: 200 },
  { day: 'Jeu', seeds: 150 },
  { day: 'Ven', seeds: 95 },
  { day: 'Sam', seeds: 0 },
  { day: 'Dim', seeds: 0 },
]

export default function SeedsClient({ balance, transactions, subscription, currentDayKey }: SeedsClientProps) {
  const weeklyTotal = MOCK_WEEKLY_DATA.reduce((sum, day) => sum + day.seeds, 0)
  const maxDailySeeds = Math.max(...MOCK_WEEKLY_DATA.map(d => d.seeds))
  const factionAverage = 320 // Mock average

  const actionCards = [
    {
      id: 'daily-harvest',
      title: 'Récolte Quotidienne',
      description: 'Reviens chaque jour pour récolter tes graines',
      reward: 50,
      icon: Sprout,
      href: `/adventure/daily-harvest/${currentDayKey}`,
    },
    {
      id: 'eco-fact',
      title: 'Eco-Fact du Jour',
      description: 'Apprends et agis avec un fait écologique',
      reward: 50,
      icon: TrendingUp,
      href: `/adventure/eco-fact/${currentDayKey}`,
    },
    {
      id: 'challenges',
      title: 'Défis Écologiques',
      description: 'Complete des défis pour gagner plus',
      reward: 500,
      icon: Award,
      href: '/adventure/defis',
    },
    {
      id: 'faction',
      title: 'Contribution Faction',
      description: 'Soutiens ta faction et gagne des graines',
      reward: 'Variable',
      icon: Crown,
      href: '/collectif',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F15]">
      <div className="relative">
        {/* Back button */}
        <div className="absolute left-5 top-8 sm:left-6 z-10">
          <Link
            href="/adventure"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ←
          </Link>
        </div>

        {/* Hero Section - Monumental Balance */}
        <div className="relative h-[50vh] flex items-center justify-center px-5 pt-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sprout className="h-8 w-8 text-lime-400" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">Solde actuel</span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-4">
                {balance.toLocaleString('fr-FR')}
              </h1>
              <p className="text-lg text-white/60 font-medium">
                +{weeklyTotal} cette semaine
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 -mt-20 bg-[#0B0F15] rounded-t-[3rem] border-t border-white/10 px-5 pb-32 pt-12 sm:px-6">
          
          {/* Analytics Chart - Apple Fitness Style */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black text-white mb-6">Cette semaine</h2>
            <div className="flex items-end justify-between gap-2 h-32 px-2">
              {MOCK_WEEKLY_DATA.map((day, index) => {
                const height = maxDailySeeds > 0 ? (day.seeds / maxDailySeeds) * 100 : 0
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.3 + (index * 0.05), duration: 0.5 }}
                        className={cn(
                          'w-full rounded-full transition-all',
                          day.seeds > 0 ? 'bg-lime-400' : 'bg-white/10'
                        )}
                        style={{ minHeight: day.seeds > 0 ? '8px' : '4px' }}
                      />
                    </div>
                    <span className="text-xs text-white/40 font-medium">{day.day}</span>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* Faction Comparison */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Comparaison Faction</h3>
                <span className={cn(
                  'text-sm font-semibold',
                  weeklyTotal > factionAverage ? 'text-lime-400' : 'text-white/60'
                )}>
                  {weeklyTotal > factionAverage ? 'Au-dessus de la moyenne !' : 'En dessous de la moyenne'}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Toi</span>
                    <span className="text-white font-bold">{weeklyTotal}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        weeklyTotal > factionAverage ? 'bg-lime-400' : 'bg-white/30'
                      )}
                      style={{ width: `${Math.min((weeklyTotal / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Moyenne faction</span>
                    <span className="text-white font-bold">{factionAverage}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: `${Math.min((factionAverage / 500) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Interactive Action Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black text-white mb-6">Gagner des graines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actionCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <Link
                    key={card.id}
                    href={card.href}
                    className="group block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.05), duration: 0.4 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-400 group-hover:bg-lime-400/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white mb-1">{card.title}</h3>
                          <p className="text-sm text-white/60 mb-2 line-clamp-2">{card.description}</p>
                          <div className="flex items-center gap-1 text-xs font-semibold text-lime-400">
                            <span>+{card.reward}</span>
                            <Sprout className="h-3 w-3" />
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.section>

          {/* History Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black text-white mb-6">Historique</h2>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.05), duration: 0.4 }}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      transaction.delta > 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'
                    )}>
                      {transaction.delta > 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{transaction.label}</p>
                      <p className="text-xs text-white/40">
                        {new Date(transaction.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'font-bold text-sm',
                    transaction.delta > 0 ? 'text-lime-400' : 'text-red-400'
                  )}>
                    {transaction.delta > 0 ? '+' : ''}{transaction.delta}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Achievements Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_ACHIEVEMENTS.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + (index * 0.05), duration: 0.4 }}
                  className={cn(
                    'rounded-2xl border p-5 transition-all',
                    achievement.unlocked 
                      ? 'border-lime-400/30 bg-lime-400/5' 
                      : 'border-white/10 bg-white/5 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{achievement.emoji}</span>
                    <div className="flex-1">
                      <h3 className={cn(
                        'font-bold mb-1',
                        achievement.unlocked ? 'text-white' : 'text-white/60'
                      )}>
                        {achievement.name}
                      </h3>
                      <p className="text-xs text-white/40 mb-3">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white/30 rounded-full"
                              style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-white/40">
                            {achievement.progress.toLocaleString('fr-FR')} / {achievement.target.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Subscription Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {subscription ? (
              <div className="rounded-3xl border border-lime-400/30 bg-gradient-to-br from-lime-400/10 to-transparent p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/20 text-lime-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Abonnement {subscription.plan_type}</h3>
                    <p className="text-sm text-white/60">Actif jusqu'au {new Date(subscription.current_period_end || '').toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-lime-400" />
                    <span className="text-white/80"><span className="font-bold text-lime-400">Boost d'Impact x2</span> sur tous les gains</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-lime-400" />
                    <span className="text-white/80">Allocation mensuelle: <span className="font-bold text-lime-400">{subscription.monthly_points_allocation} graines</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-lime-400" />
                    <span className="text-white/80">Halo Premium autour de l'avatar</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Passe à l'abonnement</h3>
                    <p className="text-sm text-white/60">Maximise ton impact</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-white/80"><span className="font-bold text-amber-400">Boost d'Impact x2</span> sur tous les gains</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-white/80">Allocation mensuelle: <span className="font-bold text-amber-400">1200 graines</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-white/80">Halo Premium exclusif</span>
                  </div>
                </div>
                <Link
                  href="/abonnement"
                  className="block w-full rounded-xl bg-amber-400 py-3 text-center font-bold text-black transition-colors hover:bg-amber-300"
                >
                  Découvrir l'abonnement
                </Link>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  )
}
