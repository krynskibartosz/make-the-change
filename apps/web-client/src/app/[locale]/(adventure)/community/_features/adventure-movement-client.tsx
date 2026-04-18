'use client'

import { useSearchParams } from 'next/navigation'
import { Bird, Globe, Gift, Leaf, PawPrint, Sprout, Star, Target, Trophy, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, getFactionThemeByKey } from '@/lib/faction-theme'
import { recordClientMockCollectiveBravo } from '@/lib/mock/mock-challenge-progress'
import { getCollectiveGoal, getFactionContribution, getFactionContributions } from '@/lib/mock/mock-factions'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { useActionAuth } from '@/hooks/use-action-auth'
import { useHaptic } from '@/hooks/use-haptic'

type ImpactEvent = {
  id: string
  name: string
  profileId?: string
  time: string
  action: string
  icon: LucideIcon
  iconColor: string
  actionHighlight?: string
  bravos: number
  avatarColor: string
  faction?: Faction
}

const MOCK_IMPACT_FEED: ImpactEvent[] = [
  {
    id: 'evt-1',
    name: 'Thomas M.',
    profileId: 'thomas-m',
    time: 'Il y a 2 min',
    action: 'A apporté ses graines 🌱 au Rucher de Manakara pour les Terres & Forêts.',
    icon: Sprout,
    iconColor: 'text-emerald-400',
    actionHighlight: 'rucher de Manakara',
    bravos: 8,
    avatarColor: 'bg-blue-500/20 text-blue-400',
    faction: 'Terres & Forêts',
  },
  {
    id: 'evt-2',
    name: 'EcoGuerrier',
    profileId: 'eco-guerrier',
    time: 'Il y a 14 min',
    action: 'A complete un defi qui renforce la part de Vie Sauvage dans la recolte commune.',
    icon: Trophy,
    iconColor: 'text-amber-400',
    actionHighlight: 'Vie Sauvage',
    bravos: 17,
    avatarColor: 'bg-lime-500/20 text-lime-400',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-3',
    name: 'Vie Sauvage',
    time: 'Il y a 31 min',
    action: 'Passe en tete avec 45% de la recolte totale ce mois-ci.',
    icon: Target,
    iconColor: 'text-amber-400',
    actionHighlight: '45%',
    bravos: 42,
    avatarColor: 'bg-amber-500/20 text-amber-300',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-4',
    name: 'Sarah L.',
    profileId: 'sarah-l',
    time: 'Il y a 1 heure',
    action: 'A debloque le Lynx Boreal dans le BioDex.',
    icon: PawPrint,
    iconColor: 'text-violet-400',
    bravos: 22,
    avatarColor: 'bg-purple-500/20 text-purple-400',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-5',
    name: 'Marie-Claire B.',
    profileId: 'marie-claire-b',
    time: 'Il y a 3 heures',
    action: 'A ajoute 120 graines au reservoir commun pour Artisans Locaux.',
    icon: Globe,
    iconColor: 'text-sky-400',
    actionHighlight: '120 graines',
    bravos: 31,
    avatarColor: 'bg-rose-500/20 text-rose-400',
    faction: 'Artisans Locaux',
  },
  {
    id: 'evt-6',
    name: 'Terres & Forêts',
    time: 'Il y a 4 heures',
    action: 'A depasse les 13 000 graines et continue de pousser le rucher vers son objectif final.',
    icon: Gift,
    iconColor: 'text-emerald-400',
    actionHighlight: '13 000 graines',
    bravos: 61,
    avatarColor: 'bg-emerald-500/20 text-emerald-300',
    faction: 'Terres & Forêts',
  },
  {
    id: 'evt-7',
    name: 'NaturaMind',
    profileId: 'natura-mind',
    time: 'Hier',
    action: 'Vient de debloquer le badge Gardien des Forets.',
    icon: Star,
    iconColor: 'text-amber-400',
    bravos: 47,
    avatarColor: 'bg-amber-500/20 text-amber-400',
    faction: 'Terres & Forêts',
  },
  {
    id: 'evt-8',
    name: 'Amira K.',
    profileId: 'amira-k',
    time: 'Hier',
    action: "A decouvert l'Aigle de Bonelli dans le BioDex.",
    icon: Bird,
    iconColor: 'text-sky-400',
    bravos: 19,
    avatarColor: 'bg-cyan-500/20 text-cyan-400',
    faction: 'Artisans Locaux',
  },
]

function ImpactAction({ event, text }: { event: ImpactEvent; text: string }) {
  if (!event.actionHighlight || !text.includes(event.actionHighlight)) {
    return <>{text}</>
  }

  const [before, after] = text.split(event.actionHighlight)

  return (
    <>
      {before}
      <strong className="font-semibold text-white">{event.actionHighlight}</strong>
      {after}
    </>
  )
}

function ImpactCard({
  event,
  onAttemptBravo,
  shouldAutoBravo = false,
  onAutoBravoConsumed,
  currentDayKey,
}: {
  event: ImpactEvent
  onAttemptBravo: (eventId: string, action: () => void) => void
  shouldAutoBravo?: boolean
  onAutoBravoConsumed?: () => void
  currentDayKey: string
}) {
  const haptic = useHaptic()
  const [bravo, setBravo] = useState(false)
  const accentTheme = getFactionTheme(event.faction ?? null)

  const handleBravoAction = useCallback(() => {
    haptic.mediumTap()
    setBravo((prev) => {
      const next = !prev

      if (next) {
        const session = getClientMockViewerSession()
        if (session?.viewerId) {
          recordClientMockCollectiveBravo({
            viewerId: session.viewerId,
            dayKey: currentDayKey,
            targetId: event.id,
          })
        }
      }

      return next
    })
  }, [currentDayKey, event.id, haptic])

  useEffect(() => {
    if (!shouldAutoBravo || bravo) {
      return
    }

    handleBravoAction()
    onAutoBravoConsumed?.()
  }, [bravo, handleBravoAction, onAutoBravoConsumed, shouldAutoBravo])

  const handleBravo = useCallback(() => {
    onAttemptBravo(event.id, handleBravoAction)
  }, [event.id, handleBravoAction, onAttemptBravo])

  const header = (
    <div className="mb-3 flex items-center gap-3">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
          event.avatarColor,
          event.profileId ? 'border-border/30' : accentTheme.accentBorder,
        )}
      >
        {event.name[0]}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-bold tracking-tight text-white">{event.name}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{event.time}</span>
        </div>
        {event.faction ? (
          <span className={cn('text-[11px] font-semibold', accentTheme.accentTextSoft)}>{event.faction}</span>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="border-b border-white/5 py-5 last:border-b-0">
      {event.profileId ? (
        <Link href={`/profile/${event.profileId}`} prefetch={false} className="block transition-opacity active:opacity-50">
          {header}
        </Link>
      ) : (
        header
      )}

      <p className="mb-3 mt-1 flex items-start gap-2 text-[15px] leading-snug text-white/70">
        <event.icon className={cn('mt-0.5 h-[18px] w-[18px] shrink-0', event.iconColor)} />
        <span>
          <ImpactAction event={event} text={event.action} />
        </span>
      </p>

      <button
        onClick={handleBravo}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5',
          bravo ? accentTheme.accentText : 'text-muted-foreground',
        )}
      >
        <Leaf className={cn('h-4 w-4 transition-transform active:scale-125', bravo && 'fill-current')} />
        Bravo
        <span className="ml-1 text-sm font-medium tabular-nums opacity-60">{event.bravos + (bravo ? 1 : 0)}</span>
      </button>
    </div>
  )
}

interface AdventureMovementClientProps {
  initialFaction: Faction | null
  currentDayKey: string
}

export function AdventureMovementClient({ initialFaction, currentDayKey }: AdventureMovementClientProps) {
  const searchParams = useSearchParams()
  const { guardAction } = useActionAuth()
  const [replayBravoId, setReplayBravoId] = useState<string | null>(null)
  const [showPrivilege, setShowPrivilege] = useState(false)
  const collectiveGoal = getCollectiveGoal()
  const factionContributions = getFactionContributions()
  const activeContribution = getFactionContribution(initialFaction)

  useEffect(() => {
    if (searchParams.get('intent') !== 'give-bravo') {
      return
    }

    setReplayBravoId(searchParams.get('targetId') || MOCK_IMPACT_FEED[0]?.id || null)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('intent')
    nextParams.delete('targetId')
    const nextQuery = nextParams.toString()
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [searchParams])

  const handleAttemptBravo = useCallback(
    (eventId: string, action: () => void) => {
      guardAction(action, {
        intent: 'give-bravo',
        extraParams: {
          targetId: eventId,
        },
      })
    },
    [guardAction],
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-24 duration-500">
      {/* ═══ SCÈNE DES MASCOTTES (Edge-to-Edge) ═══ */}
      <section className="w-full px-4 pb-4 pt-6 sm:px-6">

        {/* HEADER */}
        <div className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Objectif du mois</p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
            {collectiveGoal.projectName}
          </h2>
        </div>

        {/* JAUGE FINE + BOUTON PRIVILÈGE */}
        <div className="flex items-center gap-3">
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#1A222C]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all duration-1000"
              style={{ width: `${collectiveGoal.progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPrivilege(true)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 transition-transform hover:scale-110 active:scale-95"
            aria-label="Voir la récompense du mois"
          >
            <Gift className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/40">
          {collectiveGoal.progress}% accompli · {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} 🌱 restantes
        </p>

        {/* MODALE — LE PRIVILÈGE DE L'ESSAIM */}
        {showPrivilege && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 sm:items-center"
            onClick={() => setShowPrivilege(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panneau */}
            <div
              className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[#131820]/95 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fermer */}
              <button
                type="button"
                onClick={() => setShowPrivilege(false)}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icône */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15">
                <Gift className="h-7 w-7 text-amber-400" />
              </div>

              {/* Texte */}
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80">La Récompense du Mois</p>
              <h3 className="mt-1 text-xl font-black text-white">Le Privilège de l'Essaim</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Si l'Essaim atteint 100%, notre partenaire{' '}
                <span className="font-semibold text-white">Ilanga Nature</span>{' '}
                débloquera un privilège exclusif sur sa boutique — un geste de gratitude pour tous les Gardiens participants.
              </p>

              {/* Récompenses */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-xl">🍯</span>
                  <div>
                    <p className="text-sm font-bold text-white">15% de privilège</p>
                    <p className="text-xs text-white/50">Sur la récolte de miel Ilanga Nature</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-sm font-bold text-white">{collectiveGoal.prestigeRewardTitle}</p>
                    <p className="text-xs text-white/50">{collectiveGoal.prestigeRewardSummary}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <p className="mt-5 text-center text-xs text-white/35">
                Plus que {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} 🌱 pour débloquer ce privilège.
              </p>
            </div>
          </div>
        )}

        {/* LE PODIUM MASCOTTES */}
        {(() => {
          // Réordonner pour l'affichage en podium : [2e, 1er, 3e]
          const sorted = [...factionContributions] // déjà trié par effort desc
          const podiumOrder = [sorted[1], sorted[0], sorted[2]].filter(Boolean)

          const sizes: Record<number, string> = {
            0: 'w-20 h-20', // 2e (gauche)
            1: 'w-28 h-28', // 1er (centre)
            2: 'w-16 h-16', // 3e (droite)
          }
          const bottoms: Record<number, string> = {
            0: 'mb-2',
            1: 'mb-0',
            2: 'mb-4',
          }

          return (
            <div className="relative mt-6 flex h-44 items-end justify-center gap-2">
              {podiumOrder.map((contribution, displayIndex) => {
                if (!contribution) return null
                const theme = getFactionThemeByKey(contribution.themeKey)
                const isActiveFaction = activeContribution?.themeKey === contribution.themeKey

                let mascotSrc = ''
                if (contribution.themeKey === 'pollinisateurs') mascotSrc = '/abeille-transparente.png'
                else if (contribution.themeKey === 'forets') mascotSrc = '/sylva.png'
                else if (contribution.themeKey === 'artisans') mascotSrc = '/aura.png'

                const sizeClass = sizes[displayIndex] ?? 'w-20 h-20'
                const bottomClass = bottoms[displayIndex] ?? ''

                return (
                  <div
                    key={contribution.themeKey}
                    className={cn('relative flex flex-col items-center', bottomClass)}
                  >
                    {/* Glow derrière la mascotte de l'utilisateur */}
                    {isActiveFaction && (
                      <div
                        className={cn(
                          'absolute inset-0 -z-10 scale-150 rounded-full opacity-40 blur-2xl',
                          theme.accentBg,
                        )}
                      />
                    )}

                    {/* Mascotte */}
                    <div className={cn(sizeClass, 'relative drop-shadow-2xl')}>
                      <img
                        src={mascotSrc}
                        alt={contribution.label}
                        className="h-full w-full object-contain"
                        style={{
                          filter: isActiveFaction
                            ? 'drop-shadow(0 0 12px rgba(255,255,255,0.35))'
                            : 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
                        }}
                      />
                    </div>

                    {/* Floating Pill */}
                    <div className="mt-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 backdrop-blur-md">
                      <span className={cn('text-sm font-black', theme.accentText)}>
                        {contribution.contributionShare}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </section>

      <section className="space-y-0 border-t border-white/5 px-4 pt-2 sm:px-6">
        <div className="mb-4 flex items-center">
          <h2 className="text-xl font-bold tracking-tight text-white">Impact Global</h2>
        </div>
        <div className="relative z-0 w-full">
          {MOCK_IMPACT_FEED.map((event) => (
            <ImpactCard
              key={event.id}
              event={event}
              currentDayKey={currentDayKey}
              onAttemptBravo={handleAttemptBravo}
              shouldAutoBravo={replayBravoId === event.id}
              onAutoBravoConsumed={() => setReplayBravoId(null)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
