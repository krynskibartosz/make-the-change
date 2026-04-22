'use client'

import { useSearchParams } from 'next/navigation'
import { Bird, Clock, Crown, Droplets, Globe, Gift, Leaf, Lock, PawPrint, Sparkles, Sprout, Star, Target, Trophy, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { getFactionTheme, getFactionThemeByKey } from '@/lib/faction-theme'
import {
  getClientPersistedMockChallengeStates,
  recordClientMockCollectiveBravo,
} from '@/lib/mock/mock-challenge-progress'
import { getCollectiveGoal, getFactionContribution, getFactionContributions } from '@/lib/mock/mock-factions'
import { getCurrentSeason, getSeasonProgress, getSeasonTimeRemaining } from '@/lib/mock/mock-seasons'
import { getMockProducts } from '@/app/[locale]/(marketing)/products/_features/mock-products'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import { getMockSubscription } from '@/lib/mock/mock-member-data'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { useActionAuth } from '@/hooks/use-action-auth'
import { useHaptic } from '@/hooks/use-haptic'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'

type ImpactEvent = {
  id: string
  name: string
  profileId?: string
  avatarUrl?: string
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
    avatarUrl: 'https://i.pravatar.cc/80?u=thomas-m',
    time: 'Il y a 2 min',
    action: 'A apporté ses graines au Rucher de Manakara pour Sylva.',
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
    action: 'A complété un défi qui renforce la part de Melli dans la récolte commune.',
    icon: Trophy,
    iconColor: 'text-amber-400',
    actionHighlight: 'Melli',
    bravos: 17,
    avatarColor: 'bg-lime-500/20 text-lime-400',
    faction: 'Vie Sauvage',
  },
  {
    id: 'evt-3',
    name: 'Melli',
    time: 'Il y a 31 min',
    action: 'Passe en tête avec 45% de la récolte totale ce mois-ci.',
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
    avatarUrl: 'https://i.pravatar.cc/80?u=sarah-l',
    time: 'Il y a 1 heure',
    action: 'A débloqué le Lynx Boréal dans le BioDex.',
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
    avatarUrl: 'https://i.pravatar.cc/80?u=marie-claire-b',
    time: 'Il y a 3 heures',
    action: 'A ajouté 120 graines au réservoir commun pour Aura.',
    icon: Globe,
    iconColor: 'text-sky-400',
    actionHighlight: '120 graines',
    bravos: 31,
    avatarColor: 'bg-rose-500/20 text-rose-400',
    faction: 'Artisans Locaux',
  },
  {
    id: 'evt-6',
    name: 'Sylva',
    time: 'Il y a 4 heures',
    action: 'A dépassé les 13 000 graines et continue de pousser le rucher vers son objectif final.',
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
    action: 'Vient de débloquer le badge Gardien des Forêts.',
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
    avatarUrl: 'https://i.pravatar.cc/80?u=amira-k',
    time: 'Hier',
    action: "A découvert l'Aigle de Bonelli dans le BioDex.",
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

function getFactionImage(faction: string | undefined): string | null {
  if (!faction) return null
  if (faction === 'Terres & Forêts') return '/sylva.png'
  if (faction === 'Vie Sauvage') return '/abeille-transparente.png'
  if (faction === 'Artisans Locaux') return '/aura.png'
  return null
}

function ImpactCard({
  event,
  onAttemptBravo,
  isBravoed,
  onBravoPersisted,
  shouldAutoBravo = false,
  onAutoBravoConsumed,
  currentDayKey,
  viewerId,
}: {
  event: ImpactEvent
  onAttemptBravo: (eventId: string, action: () => void) => void
  isBravoed: boolean
  onBravoPersisted: (eventId: string) => void
  shouldAutoBravo?: boolean
  onAutoBravoConsumed?: () => void
  currentDayKey: string
  viewerId?: string | null
}) {
  const haptic = useHaptic()
  const accentTheme = getFactionTheme(event.faction ?? null)

  const handleBravoAction = useCallback(() => {
    if (isBravoed) {
      onAutoBravoConsumed?.()
      return
    }

    haptic.mediumTap()
    const session = getClientMockViewerSession()
    const effectiveViewerId = session?.viewerId ?? viewerId ?? null
    if (effectiveViewerId) {
      recordClientMockCollectiveBravo({
        viewerId: effectiveViewerId,
        dayKey: currentDayKey,
        targetId: event.id,
      })
      onBravoPersisted(event.id)
    }
  }, [currentDayKey, event.id, haptic, isBravoed, onAutoBravoConsumed, onBravoPersisted, viewerId])

  useEffect(() => {
    if (!shouldAutoBravo) {
      return
    }

    if (isBravoed) {
      onAutoBravoConsumed?.()
      return
    }

    handleBravoAction()
    onAutoBravoConsumed?.()
  }, [handleBravoAction, isBravoed, onAutoBravoConsumed, shouldAutoBravo])

  const handleBravo = useCallback(() => {
    if (isBravoed) {
      return
    }

    onAttemptBravo(event.id, handleBravoAction)
  }, [event.id, handleBravoAction, isBravoed, onAttemptBravo])

  const factionImage = getFactionImage(event.faction)

  const header = (
    <div className="mb-3 flex items-center gap-3">
      {event.avatarUrl ? (
        <img
          src={event.avatarUrl}
          alt={event.name}
          className={cn(
            'h-10 w-10 shrink-0 rounded-full border object-cover',
            event.profileId ? 'border-border/30' : accentTheme.accentBorder,
          )}
        />
      ) : factionImage ? (
        <img
          src={factionImage}
          alt={event.faction}
          className={cn(
            'h-10 w-10 shrink-0 rounded-full border object-cover',
            event.profileId ? 'border-border/30' : accentTheme.accentBorder,
          )}
        />
      ) : (
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
            event.avatarColor,
            event.profileId ? 'border-border/30' : accentTheme.accentBorder,
          )}
        >
          {event.name[0]}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-bold tracking-tight text-white">{event.name}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{event.time}</span>
        </div>
        {event.faction ? (
          <span className={cn('text-[11px] font-semibold', accentTheme.accentTextSoft)}>
            {getFactionContribution(event.faction)?.label || event.faction}
          </span>
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
        disabled={isBravoed}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5',
          isBravoed ? accentTheme.accentText : 'text-muted-foreground',
          isBravoed && 'cursor-default',
        )}
      >
        <Leaf className={cn('h-4 w-4 transition-transform active:scale-125', isBravoed && 'fill-current')} />
        {isBravoed ? 'Bravo envoyé' : 'Bravo'}
        <span className="ml-1 text-sm font-medium tabular-nums opacity-60">{event.bravos + (isBravoed ? 1 : 0)}</span>
      </button>
    </div>
  )
}

interface AdventureMovementClientProps {
  initialFaction: Faction | null
  viewerId: string | null
  currentDayKey: string
}

function SeasonCountdown() {
  const currentSeason = getCurrentSeason()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getSeasonTimeRemaining())
      setProgress(getSeasonProgress())
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}j ${hours}h`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  if (!currentSeason) return null

  return (
    <div className="mb-4 rounded-xl border border-lime-400/20 bg-lime-400/5 p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400/20">
            <Clock className="h-4 w-4 text-lime-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-400/80">
              {currentSeason.name}
            </p>
            <p className="text-xs font-semibold text-white">
              {formatTimeRemaining(timeRemaining)} restantes
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-lime-400">{Math.round(progress)}%</div>
          <div className="text-[10px] text-white/40">Progression</div>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1A222C]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function AdventureMovementClient({
  initialFaction,
  viewerId,
  currentDayKey,
}: AdventureMovementClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { guardAction } = useActionAuth({
    viewerId,
    faction: initialFaction,
  })
  const [replayBravoId, setReplayBravoId] = useState<string | null>(null)
  const [persistedBravoIds, setPersistedBravoIds] = useState<string[]>([])
  const [feedFilter, setFeedFilter] = useState<'faction' | 'global'>(initialFaction ? 'faction' : 'global')

  // État utilisateur pour la logique de redirection
  const session = getClientMockViewerSession()
  const subscription = session ? getMockSubscription(session.viewerId) : null
  const hasSubscription = subscription?.status === 'active'
  const isConnected = !!session

  const showPrivilege = searchParams.get('p') === 'reward'
  
  const collectiveGoal = getCollectiveGoal()
  const factionContributions = getFactionContributions()
  const activeContribution = getFactionContribution(initialFaction)

  useEffect(() => {
    const effectiveViewerId = getClientMockViewerSession()?.viewerId ?? viewerId ?? null

    if (!effectiveViewerId) {
      setPersistedBravoIds([])
      return
    }

    const collectiveEntry = getClientPersistedMockChallengeStates().find(
      (entry) =>
        entry.viewerId === effectiveViewerId &&
        entry.dayKey === currentDayKey &&
        entry.archetypeId === 'collective-bravo',
    )

    setPersistedBravoIds(collectiveEntry?.targetIds ?? [])
  }, [currentDayKey, viewerId])

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
      const session = getClientMockViewerSession()
      const effectiveViewerId = session?.viewerId ?? viewerId ?? null

      if (!effectiveViewerId) {
        window.location.href = '/onboarding/step-0'
        return
      }

      action()
    },
    [viewerId],
  )

  const handleBravoPersisted = useCallback((eventId: string) => {
    setPersistedBravoIds((current) => (current.includes(eventId) ? current : [...current, eventId]))
  }, [])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-24 duration-500">
      {/* ═══ SCÈNE DES MASCOTTES (Edge-to-Edge) ═══ */}
      <section className="w-full px-4 pb-4 pt-6 sm:px-6">

        {/* SEASON COUNTDOWN */}
        <SeasonCountdown />

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
          <Link
            href="?p=reward"
            scroll={false}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 transition-transform hover:scale-110 active:scale-95"
            aria-label="Voir la récompense du mois"
          >
            <Gift className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/40">
          {collectiveGoal.progress}% accompli · {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" /> restantes
        </p>

        {/* FULL-SCREEN — LE PRIVILEGE DE L'ESSAIM */}
        {showPrivilege && (
          <FullScreenSlideModal
            title="Le Privilège de l'Essaim"
            headerMode="close"
            fallbackHref="/collectif"
            onClose={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('p')
              router.push(`?${params.toString()}`, { scroll: false })
            }}
            className="z-[100]"
          >
            {(() => {
              const ilangaProducts = getMockProducts().filter(
                (p) => p.producer_id === 'mock-producer-ilanga-nature',
              )
              
              let mascotSrc = '/sylva.png'
              if (activeContribution?.themeKey === 'pollinisateurs') mascotSrc = '/abeille-transparente.png'
              else if (activeContribution?.themeKey === 'artisans') mascotSrc = '/aura.png'
              
              const activeTheme = getFactionThemeByKey(activeContribution?.themeKey ?? 'forets')

              return (
                <div className="flex min-h-full flex-col relative">
                  <div className="flex flex-col gap-8 px-5 pb-28 pt-8 sm:px-6">

                    {/* En-tête : Mascotte & Titre */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 ${activeTheme.accentBg}`} />
                        <img src={mascotSrc} alt="Mascotte faction" className="relative z-10 h-full w-full object-contain drop-shadow-2xl" />
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeTheme.accentTextSoft}`}>
                        La Récompense du Mois
                      </p>
                      <h2 className="mt-1 text-2xl font-black text-white">Le Privilège de l'Essaim</h2>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        Si l'Essaim atteint 100%, notre partenaire{' '}
                        <span className="font-semibold text-white">Ilanga Nature</span>{' '}
                        débloquera un privilège exclusif sur sa boutique — un geste de gratitude pour tous les Gardiens participants.
                      </p>
                    </div>

                    {/* Jauge de progression (Focus) */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Progression collective</span>
                        <span className="font-bold text-white">{collectiveGoal.progress}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1A222C]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                          style={{ width: `${collectiveGoal.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-center text-[11px] text-white/40">
                        Plus que {(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds).toLocaleString('fr-FR')} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" /> restantes
                      </p>
                    </div>

                    {/* Récompenses (Sleek List) */}
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Ce qui vous attend</p>
                      
                      <div className="flex items-center gap-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                          <Droplets className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="flex-1 border-b border-white/5 pb-4">
                          <p className="text-base font-bold text-white">15% de privilège</p>
                          <p className="text-sm text-white/50">Sur la récolte de miel Ilanga Nature</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-400/10">
                          <Sparkles className="h-4 w-4 text-violet-400" />
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-base font-bold text-white">{collectiveGoal.prestigeRewardTitle}</p>
                          <p className="text-sm text-white/50">{collectiveGoal.prestigeRewardSummary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Produits du partenaire */}
                    {ilangaProducts.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                          La récolte d'Ilanga Nature
                        </p>
                        <div className="relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-5 sm:-mx-6 sm:pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {ilangaProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              prefetch={false}
                              className="group flex w-44 shrink-0 snap-center flex-col overflow-hidden transition-transform active:scale-[0.97]"
                            >
                              <div className="aspect-square w-full overflow-hidden rounded-[1.5rem] bg-white/5 border border-white/5">
                                <img
                                  src={product.image_url}
                                  alt={product.name_default}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                              <div className="mt-3 flex flex-col gap-0.5">
                                <p className="text-sm font-bold text-white line-clamp-1">{product.name_default}</p>
                                <p className="text-xs text-white/50 line-clamp-1">{product.short_description_default}</p>
                                <p className="mt-1 text-sm font-black text-amber-400">{product.price_points} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" /></p>
                              </div>
                            </Link>
                          ))}
                          <div className="w-1 shrink-0" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Encart abonnement contextuel si connecté sans abonnement */}
                  {isConnected && initialFaction && !hasSubscription && (
                    <div className="mx-5 mb-4 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 sm:mx-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white/60">Accès Récompenses</span>
                          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                            👑 Gardiens
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/40">
                          Débloquez les récompenses exclusives de la saison collective.
                        </p>
                      </div>
                      <Lock className="h-4 w-4 shrink-0 text-white/25" />
                    </div>
                  )}

                  {/* Bouton Sticky */}
                  <div className="sticky bottom-0 z-20 w-full border-t border-white/5 bg-[#0B0F15]/80 p-5 backdrop-blur-xl sm:px-6">
                    {!isConnected ? (
                      <Link
                        href="/onboarding/step-0"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Rejoindre pour participer <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
                      </Link>
                    ) : !initialFaction ? (
                      <Link
                        href="/welcome/setup"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Choisir votre faction <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
                      </Link>
                    ) : !hasSubscription ? (
                      <Link
                        href="/dashboard/subscription"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-sm font-bold text-black shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Débloquer les récompenses <Crown className="inline h-[1.2em] w-[1.2em] align-text-bottom" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString())
                          params.delete('p')
                          router.push(`?${params.toString()}`, { scroll: false })
                        }}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Compris, let's go ! <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })()}
          </FullScreenSlideModal>
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
                    <div className="mt-1 text-[10px] text-white/40">
                      {contribution.label}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </section>

      <section className="space-y-0 border-t border-white/5 px-4 pt-2 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">Impact Global</h2>
          {initialFaction && (
            <div className="flex items-center rounded-full bg-white/5 p-1">
              <button
                onClick={() => setFeedFilter('faction')}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  feedFilter === 'faction' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                )}
              >
                Ma Faction
              </button>
              <button
                onClick={() => setFeedFilter('global')}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  feedFilter === 'global' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                )}
              >
                Global
              </button>
            </div>
          )}
        </div>
        <div className="relative z-0 w-full">
          {MOCK_IMPACT_FEED.filter(event => feedFilter === 'global' || !initialFaction || event.faction === initialFaction).map((event) => (
            <ImpactCard
              key={event.id}
              event={event}
              isBravoed={persistedBravoIds.includes(event.id)}
              onBravoPersisted={handleBravoPersisted}
              currentDayKey={currentDayKey}
              viewerId={viewerId}
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
