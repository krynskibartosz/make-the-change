'use client'

import { useSearchParams } from 'next/navigation'
import { Bird, Globe, Gift, Leaf, PawPrint, Sparkles, Sprout, Star, Target, Trophy, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, getFactionThemeByKey } from '@/lib/faction-theme'
import { getCollectiveGoal, getFactionContribution, getFactionContributions } from '@/lib/mock/mock-factions'
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
}: {
  event: ImpactEvent
  onAttemptBravo: (eventId: string, action: () => void) => void
  shouldAutoBravo?: boolean
  onAutoBravoConsumed?: () => void
}) {
  const haptic = useHaptic()
  const [bravo, setBravo] = useState(false)
  const accentTheme = getFactionTheme(event.faction ?? null)

  const handleBravoAction = useCallback(() => {
    haptic.mediumTap()
    setBravo((prev) => !prev)
  }, [haptic])

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
}

export function AdventureMovementClient({ initialFaction }: AdventureMovementClientProps) {
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
      <section className="space-y-4 px-4 sm:px-6">
        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="grid gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Objectif commun du mois</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{collectiveGoal.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{collectiveGoal.summary}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                {collectiveGoal.projectName}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Reservoir collectif</p>
                  <p className="mt-2 text-3xl font-black text-white">{collectiveGoal.currentSeeds.toLocaleString('fr-FR')}</p>
                  <p className="mt-1 text-sm text-white/55">sur {collectiveGoal.targetSeeds.toLocaleString('fr-FR')} graines</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Progression</p>
                  <p className="mt-2 text-3xl font-black text-white">{collectiveGoal.progress}%</p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-white via-amber-300 to-emerald-300" style={{ width: `${collectiveGoal.progress}%` }} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    <Gift className="h-4 w-4 text-white/70" />
                    Recompense commune
                  </div>
                  <p className="mt-2 text-sm font-black text-white">{collectiveGoal.commonRewardTitle}</p>
                  <p className="mt-1 text-sm text-white/60">{collectiveGoal.commonRewardSummary}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    <Sparkles className="h-4 w-4 text-white/70" />
                    Prestige de faction
                  </div>
                  <p className="mt-2 text-sm font-black text-white">{collectiveGoal.prestigeRewardTitle}</p>
                  <p className="mt-1 text-sm text-white/60">{collectiveGoal.prestigeRewardSummary}</p>
                </div>
              </div>
            </div>

            <Link
              href={activeContribution ? '/aventure?tab=defis' : '/setup'}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-black transition-transform active:scale-[0.98]"
            >
              {activeContribution ? `Faire un defi pour aider ${activeContribution.label}` : 'Choisir une faction pour contribuer'}
            </Link>
          </div>
        </article>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Contribution des factions</h3>
              <p className="mt-1 text-sm text-white/55">Le classement indique qui pousse le plus fort vers l objectif commun.</p>
            </div>
          </div>

          {factionContributions.map((contribution) => {
            const theme = getFactionThemeByKey(contribution.themeKey)
            const isActiveFaction = activeContribution?.themeKey === contribution.themeKey

            return (
              <article
                key={contribution.themeKey}
                className={cn(
                  'rounded-[1.75rem] border bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
                  theme.accentBorder,
                  isActiveFaction && `${theme.accentBgSoft} ${theme.accentShadow}`,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('text-[11px] font-semibold uppercase tracking-[0.22em]', theme.accentTextSoft)}>
                        {contribution.isLeader ? 'En tete' : `#${contribution.rank}`}
                      </span>
                      {isActiveFaction ? (
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]', theme.badgeClassName, theme.accentText)}>
                          Ma faction
                        </span>
                      ) : null}
                    </div>
                    <h4 className="mt-2 text-lg font-black text-white">{contribution.label}</h4>
                    <p className="mt-1 text-sm text-white/60">{contribution.tagline}</p>
                  </div>

                  <div className="text-right">
                    <p className={cn('text-2xl font-black', theme.accentText)}>{contribution.contributionShare}%</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">de l effort</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Graines apportees</div>
                    <p className="mt-2 text-xl font-black text-white">{contribution.contributionSeeds.toLocaleString('fr-FR')}</p>
                    <p className="mt-1 text-sm text-white/55">{contribution.members} membres actifs</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Impact reel</div>
                    <p className="mt-2 text-xl font-black text-white">{contribution.impactValue}</p>
                    <p className="mt-1 text-sm text-white/55">{contribution.impactLabel}</p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={cn('h-full rounded-full', theme.accentBg)} style={{ width: `${contribution.contributionShare}%` }} />
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <p className="text-sm text-white/60">{contribution.rallyLabel}</p>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Prestige si 1ere</p>
                    <p className={cn('mt-1 text-sm font-black', theme.accentText)}>{contribution.prestigeTitle}</p>
                  </div>
                </div>
              </article>
            )
          })}
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
