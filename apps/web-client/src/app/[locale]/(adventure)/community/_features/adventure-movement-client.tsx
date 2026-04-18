'use client'

import { useSearchParams } from 'next/navigation'
import { Bird, Globe, Gift, Leaf, PawPrint, Sprout, Star, Target, Trophy, type LucideIcon } from 'lucide-react'
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
    action: 'Vient de soutenir le rucher de Manakara avec sa contribution Terres & Forêts.',
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
      <section className="px-4 sm:px-6">
        <div className="rounded-3xl bg-[#131820]/80 p-6 backdrop-blur-xl">
          {/* SECTION 1 : LA QUÊTE COMMUNAUTAIRE */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Objectif Commun : {collectiveGoal.projectName}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Plus que {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} 🌱 pour financer le projet.
            </p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-rose-500"
                style={{ width: `${collectiveGoal.progress}%` }}
              />
            </div>
          </div>

          {/* SECTION 2 : LE SPLIT DES FACTIONS */}
          <div className="flex flex-col gap-3">
            {factionContributions.map((contribution) => {
              const theme = getFactionThemeByKey(contribution.themeKey)
              const isActiveFaction = activeContribution?.themeKey === contribution.themeKey

              return (
                <div
                  key={contribution.themeKey}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform',
                    theme.accentBgSoft,
                    isActiveFaction ? cn('border scale-[1.02]', theme.accentBorder, theme.accentShadow) : 'border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
                      theme.accentBgSoft,
                      theme.accentBorder,
                      theme.accentText
                    )}
                  >
                    {contribution.shortLabel[0]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white tracking-tight">{contribution.label}</span>
                      <span className={cn('font-black', theme.accentText)}>{contribution.contributionShare}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className={cn('h-full rounded-full', theme.accentBg)} style={{ width: `${contribution.contributionShare}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
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
