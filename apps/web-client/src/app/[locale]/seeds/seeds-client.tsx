'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Sprout, TrendingUp, Award, Zap, Crown, ChevronRight, Clock, PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

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

// Mock weekly analytics data (last 7 days) - Apple Fitness style
const MOCK_WEEKLY_DATA = [
  { day: 'Lun', seeds: 120, isToday: false },
  { day: 'Mar', seeds: 85, isToday: false },
  { day: 'Mer', seeds: 200, isToday: false },
  { day: 'Jeu', seeds: 150, isToday: false },
  { day: 'Ven', seeds: 95, isToday: false },
  { day: 'Sam', seeds: 0, isToday: false },
  { day: 'Dim', seeds: 0, isToday: true },
]

const MOCK_CHALLENGE_POSTERS = [
  { id: '1', title: 'Marche 5km', reward: 100, image: '🚶', href: '/aventure?tab=defis' },
  { id: '2', title: 'Plante un arbre', reward: 500, image: '🌳', href: '/collectif' },
  { id: '3', title: 'Réduis tes déchets', reward: 75, image: '♻️', href: '/aventure?tab=defis' },
  { id: '4', title: 'Éco-Fact du jour', reward: 50, image: '📖', href: `/aventure/eco-fact/today` },
]

export default function SeedsClient({ balance, transactions, subscription, currentDayKey }: SeedsClientProps) {
  const weeklyTotal = MOCK_WEEKLY_DATA.reduce((sum, day) => sum + day.seeds, 0)
  const maxDailySeeds = Math.max(...MOCK_WEEKLY_DATA.map(d => d.seeds), 1)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, -1])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsHeaderSticky(true)
      } else {
        setIsHeaderSticky(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const treesEquivalent = Math.floor(balance / 500) // Mock calculation

  return (
    <div className="min-h-screen bg-[#0B0F15]">
      {/* Sticky Header with Balance */}
      <div className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isHeaderSticky ? 'bg-[#0B0F15]/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      )}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/adventure"
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                isHeaderSticky ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' : 'bg-transparent text-white/60 hover:bg-white/5'
              )}
            >
              ←
            </Link>
            {isHeaderSticky && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-xl">✨</span>
                <span className="text-lg font-bold text-white">{balance.toLocaleString('fr-FR')}</span>
              </motion.div>
            )}
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Hero Section - The Sanctuary */}
      <motion.div
        ref={heroRef}
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-[60vh] flex items-center justify-center px-6 pt-24"
      >
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Balance */}
            <h1 className="text-7xl sm:text-8xl font-black text-white tracking-tight mb-6">
              <span className="inline-block mr-2">✨</span>
              {balance.toLocaleString('fr-FR')}
            </h1>

            {/* Glassmorphism Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <span className="text-lg">🌿</span>
              <span className="text-sm font-medium text-white/80">
                Ton impact équivaut à la plantation de ~{treesEquivalent} arbres
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="relative z-10 px-5 pb-32 pt-8 sm:px-6">
        
        {/* Quick Actions - Bento Layout */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 - Faction Support */}
            <Link
              href="/collectif"
              className="group relative block h-40 rounded-2xl bg-[#1C1C1E] border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="p-5 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <img src="/abeille-transparente.png" alt="Melli" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Soutenir la faction</h3>
                  <p className="text-xs text-white/50">Injecte des graines</p>
                </div>
              </div>
            </Link>

            {/* Card 2 - BioDex */}
            <Link
              href="/biodex"
              className="group relative block h-40 rounded-2xl bg-[#151517] border border-white/10 overflow-hidden hover:border-lime-400/30 transition-all"
            >
              <div className="p-5 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-full bg-lime-400/10 flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Évoluer le BioDex</h3>
                  <p className="text-xs text-white/50">Découvre des espèces</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Weekly Tracker - Apple Fitness Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">Récolte de la semaine</h2>
          <div className="flex items-end justify-between gap-3 h-16 px-2">
            {MOCK_WEEKLY_DATA.map((day, index) => {
              const height = day.seeds > 0 ? Math.max((day.seeds / maxDailySeeds) * 100, 20) : 4
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.4 + (index * 0.05), duration: 0.5 }}
                      className={cn(
                        'w-full rounded-full transition-all',
                        day.isToday 
                          ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' 
                          : day.seeds > 0 
                            ? 'bg-amber-400/30' 
                            : 'bg-white/5'
                      )}
                    />
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    day.isToday ? 'text-white' : 'text-white/40'
                  )}>{day.day}</span>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Upsell Premium - Only if not subscribed */}
        {!subscription && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Passe en Pollinisateur+ et double ton impact
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      Tes {balance.toLocaleString('fr-FR')} graines vaudraient {(balance * 2).toLocaleString('fr-FR')}
                    </p>
                    <Link
                      href="/abonnement"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                    >
                      <Zap className="h-4 w-4" />
                      Découvrir
                    </Link>
                  </div>
                  <Crown className="h-8 w-8 text-amber-400/50" />
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Challenge Carousel - Horizontal Scroll */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">Gagner plus de graines</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {MOCK_CHALLENGE_POSTERS.map((poster, index) => (
              <Link
                key={poster.id}
                href={poster.href}
                className="flex-shrink-0 w-48 snap-start"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.05), duration: 0.4 }}
                  className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-black border border-white/10 group"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{poster.image}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white mb-1">{poster.title}</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-lime-400">
                      <span>+{poster.reward}</span>
                      <Sprout className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* History - Edge to Edge List */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Mon carnet de route</h2>
          <div className="border-t border-b border-white/5 divide-y divide-white/5">
            {transactions.slice(0, 10).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.03), duration: 0.3 }}
                className="flex items-center justify-between py-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{transaction.label}</p>
                  <p className="text-xs text-[#8E8E93]">
                    • Il y a {Math.floor((Date.now() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60))}h
                  </p>
                </div>
                <span className={cn(
                  'font-bold text-sm ml-4',
                  transaction.delta > 0 ? 'text-[#32D74B]' : 'text-white/60'
                )}>
                  {transaction.delta > 0 ? '+ ' : ''}{transaction.delta} ✨
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
