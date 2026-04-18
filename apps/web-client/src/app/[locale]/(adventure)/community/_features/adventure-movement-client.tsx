'use client'

import { useSearchParams } from 'next/navigation'
import { Bird, Globe, Gift, Leaf, PawPrint, Sprout, Star, Target, Trophy, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, getFactionThemeByKey } from '@/lib/faction-theme'
import { getFactionCampaign, getFactionCampaigns } from '@/lib/mock/mock-factions'
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
    action: 'Vient de soutenir le projet Foret Mediterraneenne',
    icon: Sprout,
    iconColor: 'text-emerald-400',
    actionHighlight: 'Foret Mediterraneenne',
    bravos: 8,
    avatarColor: 'bg-blue-500/20 text-blue-400',
    faction: 'Terres & Forêts',
  },
  {
    id: 'evt-2',
    name: 'EcoGuerrier',
    profileId: 'eco-guerrier',
    time: 'Il y a 14 min',
    action: 'A valide une serie de 7 jours pour Vie Sauvage',
    icon: Trophy,
    iconColor: 'text-amber-400',
    actionHighlight: 'Vie Sauvage',
    bravos: 17,
    avatarColor: 'bg-lime-500/20 text-lime-400',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-3',
    name: 'Terres & Forets',
    time: 'Il y a 31 min',
    action: 'Passe la barre des 64% sur la quete Ceinture de regeneration',
    icon: Target,
    iconColor: 'text-emerald-400',
    actionHighlight: 'Ceinture de regeneration',
    bravos: 42,
    avatarColor: 'bg-emerald-500/20 text-emerald-300',
    faction: 'Terres & Forêts',
  },
  {
    id: 'evt-4',
    name: 'Sarah L.',
    profileId: 'sarah-l',
    time: 'Il y a 1 heure',
    action: 'A debloque le Lynx Boreal dans le BioDex',
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
    action: 'A fait gagner 120 points a Artisans Locaux',
    icon: Globe,
    iconColor: 'text-sky-400',
    actionHighlight: 'Artisans Locaux',
    bravos: 31,
    avatarColor: 'bg-rose-500/20 text-rose-400',
    faction: 'Artisans Locaux',
  },
  {
    id: 'evt-6',
    name: 'Vie Sauvage',
    time: 'Il y a 4 heures',
    action: 'S approche de la recompense Pack Nectar avec 78% de progression',
    icon: Gift,
    iconColor: 'text-amber-400',
    actionHighlight: 'Pack Nectar',
    bravos: 61,
    avatarColor: 'bg-amber-500/20 text-amber-300',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-7',
    name: 'NaturaMind',
    profileId: 'natura-mind',
    time: 'Hier',
    action: 'Vient de debloquer le badge Gardien des Forets',
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
    action: "A decouvert l'Aigle de Bonelli dans le BioDex",
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
  const factionCampaigns = getFactionCampaigns()
  const activeCampaign = getFactionCampaign(initialFaction)

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
    <div className="animate-in slide-in-from-bottom-2 fade-in space-y-8 pb-24 duration-500">
      <section className="space-y-4 px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Classement des factions</h2>
            <p className="mt-1 text-sm text-white/55">Une quete principale et une recompense dediee pour chacune.</p>
          </div>
          {activeCampaign ? (
            <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${getFactionTheme(initialFaction).badgeClassName} ${getFactionTheme(initialFaction).accentText}`}>
              Votre camp
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          {factionCampaigns.map((campaign) => {
            const theme = getFactionThemeByKey(campaign.themeKey)
            const isActiveFaction = activeCampaign?.themeKey === campaign.themeKey

            return (
              <article
                key={campaign.themeKey}
                className={cn(
                  'overflow-hidden rounded-3xl border bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)]',
                  theme.accentBorder,
                  isActiveFaction && `${theme.accentBgSoft} ${theme.accentShadow}`,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[11px] font-semibold uppercase tracking-[0.22em]', theme.accentTextSoft)}>
                        #{campaign.rank}
                      </span>
                      {isActiveFaction ? (
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]', theme.badgeClassName, theme.accentText)}>
                          Ma faction
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-lg font-black text-white">{campaign.label}</h3>
                    <p className="mt-1 text-sm text-white/60">{campaign.tagline}</p>
                  </div>

                  <div className={cn('rounded-full border px-3 py-1 text-sm font-bold tabular-nums', theme.badgeClassName, theme.accentText)}>
                    {campaign.score.toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                      <Target className={cn('h-4 w-4', theme.accentText)} />
                      Quete du mois
                    </div>
                    <p className="mt-2 text-sm font-bold text-white">{campaign.monthlyQuestTitle}</p>
                    <p className="mt-1 text-sm text-white/60">{campaign.monthlyQuestSummary}</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className={cn('h-full rounded-full', theme.accentBg)} style={{ width: `${campaign.monthlyQuestProgress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Membres actifs</div>
                      <p className="mt-2 text-lg font-black text-white">{campaign.members.toLocaleString('fr-FR')}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                        <Gift className={cn('h-4 w-4', theme.accentText)} />
                        Recompense
                      </div>
                      <p className="mt-2 text-sm font-black text-white">{campaign.rewardTitle}</p>
                      <p className={cn('mt-1 text-xs font-semibold', theme.accentText)}>+{campaign.rewardSeeds} graines</p>
                    </div>
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
