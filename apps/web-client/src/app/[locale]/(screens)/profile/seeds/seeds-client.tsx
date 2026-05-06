'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { Sprout, Zap, BookOpen, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { useCallback, useState } from 'react'
import type { SpeciesContext } from '@/types/species'

interface SeedsClientProps {
  balance: number
  transactions: Array<{
    id: string
    label: string
    delta: number
    createdAt: string
  }>
  currentDayKey: string
  featuredSpecies: SpeciesContext[]
}

// ─── Rareté déduite du statut IUCN (aligné sur species-card-enhanced.tsx) ───
type Rarity = 'common' | 'rare' | 'legendary'

function getRarity(status: string | null | undefined): Rarity {
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

const RARITY_STYLES: Record<Rarity, { textColor: string; label: string; borderColor: string }> = {
  common: {
    textColor: 'text-emerald-500/60',
    label: 'Commun',
    borderColor: 'border-white/5',
  },
  rare: {
    textColor: 'text-blue-400/70',
    label: 'Rare',
    borderColor: 'border-blue-400/20',
  },
  legendary: {
    textColor: 'text-amber-400/80',
    label: 'Légendaire',
    borderColor: 'border-amber-400/25',
  },
}

// ─── Fallback emoji (aligné sur species-card-enhanced.tsx) ───────────────────
function getSpeciesEmoji(status: string | null | undefined, name: string): string {
  const s = status?.toUpperCase()
  if (s === 'CR' || s === 'EW' || s === 'EX') return '🦁'
  if (s === 'EN') return '🐺'
  if (s === 'VU') return '🦉'
  if (s === 'NT') return '🦊'
  const n = name.toLowerCase()
  if (n.includes('abeille') || n.includes('apis')) return '🐝'
  if (n.includes('bourdon')) return '🐝'
  if (n.includes('papillon')) return '🦋'
  if (n.includes('coccinelle')) return '🐞'
  if (n.includes('tortue')) return '🐢'
  if (n.includes('corail') || n.includes('acropora')) return '🪸'
  if (n.includes('olivier')) return '🫒'
  if (n.includes('grenouille')) return '🐸'
  if (n.includes('caméléon')) return '🦎'
  if (n.includes('lémurien') || n.includes('indri') || n.includes('sifaka') || n.includes('vari')) return '🐒'
  return '🌿'
}

// ─── Libellé catégorie de transaction ────────────────────────────────────────
function getTransactionCategory(label: string, delta: number): { icon: React.ReactNode; color: string } {
  const l = label.toLowerCase()
  if (delta > 0) {
    return {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      color: 'text-amber-400',
    }
  }
  return {
    icon: <TrendingDown className="h-3.5 w-3.5" />,
    color: 'text-white/40',
  }
}

export default function SeedsClient({
  balance,
  transactions,
  currentDayKey,
  featuredSpecies,
}: SeedsClientProps) {
  const router = useRouter()
  const [titleVisible, setTitleVisible] = useState(false)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setTitleVisible(e.currentTarget.scrollTop > 80)
  }, [])

  const screenHeader = (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 hover:text-white transition-colors -ml-1"
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span
        className={cn(
          'flex-1 text-center text-sm font-semibold text-white transition-opacity duration-300',
          titleVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        Mes Graines
      </span>
      {/* Icône balance visible dans la navbar — disparaît quand le titre est visible */}
      <div className={cn(
        'flex items-center gap-1.5 transition-opacity duration-300',
        titleVisible ? 'opacity-0' : 'opacity-100',
      )}>
        <Sprout className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-bold text-white tabular-nums">
          {balance.toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  )

  return (
    <Screen header={screenHeader} onScroll={handleScroll}>
      <div className="relative z-10 px-5 pb-32 sm:px-6">

        {/* ── Inline Header ─────────────────────────────────────────── */}
        <div className="pt-6 pb-8">
          <div className="flex items-end justify-between mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Mes Graines</h1>
            <div className="flex items-center gap-1.5 pb-1">
              <Sprout className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-bold text-white tabular-nums">
                {balance.toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          <p className="text-sm text-white/50">
            Gagnez des Graines en complétant vos défis quotidiens
          </p>
        </div>

        {/* ── Défis du jour ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Gagner des Graines
          </h2>
          <div className="space-y-3">
            {/* Récolte quotidienne */}
            <Link
              href={`/challenges/daily-harvest/${currentDayKey}`}
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-amber-500/30 active:scale-[0.98] transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Récolte quotidienne</h3>
                    <p className="text-xs text-white/40 mt-0.5">Action immédiate · disponible aujourd'hui</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+50</span>
                  <Sprout className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </Link>

            {/* Éco-Fact du jour */}
            <Link
              href={`/challenges/eco-fact/${currentDayKey}`}
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-sky-400/30 active:scale-[0.98] transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Éco-Fact du jour</h3>
                    <p className="text-xs text-white/40 mt-0.5">Apprends & gagne · lecture 30 sec</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+50</span>
                  <Sprout className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* ── Espèces à soutenir — BioDex Style ────────────────────── */}
        {featuredSpecies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
                Espèces à soutenir
              </h2>
              <Link
                href="/profile/biodex"
                className="text-xs text-amber-400/80 hover:text-amber-400 font-medium transition-colors"
              >
                Voir tout →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
              {featuredSpecies.map((species, index) => {
                const rarity = getRarity(species.conservation_status)
                const rarityStyle = RARITY_STYLES[rarity]
                const emoji = getSpeciesEmoji(species.conservation_status, species.name_default)
                const isUnlocked = species.user_status?.isUnlocked ?? false

                return (
                  <Link
                    key={species.id}
                    href={isUnlocked ? `/profile/biodex/${species.id}` : '/profile/biodex'}
                    className="flex-shrink-0 w-36 snap-start"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + index * 0.07, duration: 0.4 }}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-3xl border bg-white/5 backdrop-blur-xl transition-all duration-150 active:scale-[0.97]',
                        rarityStyle.borderColor,
                      )}
                    >
                      {/* Image ou emoji */}
                      <div className="w-full aspect-square">
                        {species.image_url ? (
                          <img
                            src={species.image_url}
                            alt={species.name_default}
                            className={cn(
                              'h-full w-full object-contain transition-all duration-700',
                              !isUnlocked && 'grayscale opacity-40 blur-[2px]',
                            )}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className={cn('text-4xl', !isUnlocked && 'opacity-20')}>
                              {emoji}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Nom */}
                      <p
                        className={cn(
                          'text-xs font-medium text-center leading-snug line-clamp-2',
                          !isUnlocked ? 'text-white/40' : 'text-white/90',
                        )}
                      >
                        {species.name_default}
                      </p>

                      {/* Rareté */}
                      <p className={cn('text-[10px] uppercase tracking-wider font-medium', !isUnlocked ? 'text-white/20' : rarityStyle.textColor)}>
                        {rarityStyle.label}
                      </p>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* ── Historique des transactions ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Historique
          </h2>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sprout className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-sm text-white/30">Aucune transaction pour l'instant</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              {transactions.slice(0, 12).map((transaction, index) => {
                const { icon, color } = getTransactionCategory(transaction.label, transaction.delta)
                const hoursAgo = Math.floor(
                  (Date.now() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60),
                )
                const timeLabel =
                  hoursAgo < 1
                    ? "À l'instant"
                    : hoursAgo < 24
                    ? `Il y a ${hoursAgo}h`
                    : `Il y a ${Math.floor(hoursAgo / 24)}j`

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.03, duration: 0.3 }}
                    className={cn(
                      'flex items-center justify-between px-5 py-4',
                      index < transactions.slice(0, 12).length - 1 && 'border-b border-white/5',
                    )}
                  >
                    {/* Icône + label */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('shrink-0', color)}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/90 truncate">
                          {transaction.label}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">{timeLabel}</p>
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <span
                        className={cn(
                          'font-bold text-sm tabular-nums',
                          transaction.delta > 0 ? 'text-amber-400' : 'text-white/40',
                        )}
                      >
                        {transaction.delta > 0 ? '+' : ''}
                        {transaction.delta.toLocaleString('fr-FR')}
                      </span>
                      <Sprout
                        className={cn(
                          'h-3.5 w-3.5',
                          transaction.delta > 0 ? 'text-amber-400' : 'text-white/30',
                        )}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>
      </div>
    </Screen>
  )
}
