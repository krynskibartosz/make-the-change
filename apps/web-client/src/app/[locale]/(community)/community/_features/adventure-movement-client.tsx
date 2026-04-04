'use client'

import { Badge, Card, CardTitle } from '@make-the-change/core/ui'
import { Heart, Users, Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Guild = {
  id: string
  slug: string
  name: string
  banner_url?: string | null
  logo_url?: string | null
  members_count?: number | null
  is_member?: boolean
}

type ImpactEvent = {
  id: string
  name: string
  avatar?: string
  time: string
  action: string
  likes: number
  bravos: number
  avatarColor: string
}

// ─── Mock Collective Goals ────────────────────────────────────────────────────
// Clé = guild.slug, valeur = objectif mensuel mocké
const TRIBE_GOALS: Record<string, { label: string; percent: number }> = {
  'agroforest-pioneers': { label: '5 000 arbres plantés', percent: 73 },
  'gardiens-de-leau': { label: '10 000 L d\'eau économisés', percent: 48 },
  'zero-dechet': { label: '500 kg de déchets évités', percent: 91 },
  default: { label: 'Objectif mensuel commun', percent: 62 },
}

// ─── Mock Impact Feed ─────────────────────────────────────────────────────────

const MOCK_IMPACT_FEED: ImpactEvent[] = [
  {
    id: 'evt-1',
    name: 'Thomas M.',
    time: 'Il y a 2 min',
    action: '🌱 Vient de soutenir le projet Forêt Méditerranéenne',
    likes: 24,
    bravos: 8,
    avatarColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'evt-2',
    name: 'ÉcoGuerrier',
    time: 'Il y a 14 min',
    action: '🏆 A validé une Série de 7 jours',
    likes: 41,
    bravos: 17,
    avatarColor: 'bg-lime-500/20 text-lime-400',
  },
  {
    id: 'evt-3',
    name: 'Sarah L.',
    time: 'Il y a 1 heure',
    action: '🦋 A débloqué le Lynx Boréal dans le BioDex',
    likes: 63,
    bravos: 22,
    avatarColor: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'evt-4',
    name: 'Citoyen Anonyme',
    time: 'Il y a 2 heures',
    action: '🤝 A rejoint la Tribu Agroforest Pioneers',
    likes: 18,
    bravos: 5,
    avatarColor: 'bg-zinc-500/20 text-zinc-400',
  },
  {
    id: 'evt-5',
    name: 'Marie-Claire B.',
    time: 'Il y a 3 heures',
    action: '🌍 A participé à la collecte de fonds Zones Humides',
    likes: 89,
    bravos: 31,
    avatarColor: 'bg-rose-500/20 text-rose-400',
  },
  {
    id: 'evt-6',
    name: 'Lucas V.',
    time: 'Il y a 5 heures',
    action: '🌿 A validé le défi « Zéro Déchet » de la semaine',
    likes: 35,
    bravos: 12,
    avatarColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'evt-7',
    name: 'NaturaMind',
    time: 'Hier',
    action: '⭐ Vient de débloquer le badge Gardien des Forêts',
    likes: 112,
    bravos: 47,
    avatarColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'evt-8',
    name: 'Amira K.',
    time: 'Hier',
    action: "🦅 A découvert l'Aigle de Bonelli dans le BioDex",
    likes: 57,
    bravos: 19,
    avatarColor: 'bg-cyan-500/20 text-cyan-400',
  },
]

// ─── Interaction card with haptics ───────────────────────────────────────────

function ImpactCard({ event }: { event: ImpactEvent }) {
  const [likedBy, setLikedBy] = useState<Record<string, boolean>>({})

  const handleInspiring = useCallback(() => {
    navigator.vibrate?.(10)
    setLikedBy((prev) => ({ ...prev, inspiring: !prev.inspiring }))
  }, [])

  const handleBravo = useCallback(() => {
    navigator.vibrate?.(10)
    setLikedBy((prev) => ({ ...prev, bravo: !prev.bravo }))
  }, [])

  return (
    <div className="bg-card dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-border/50 hover:bg-muted/30 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10 shrink-0 border border-border/30 shadow-sm">
          {event.avatar ? <AvatarImage src={event.avatar} /> : null}
          <AvatarFallback className={`font-bold text-sm ${event.avatarColor}`}>
            {event.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-foreground leading-none truncate">{event.name}</span>
          <span className="text-xs text-muted-foreground mt-1">{event.time}</span>
        </div>
      </div>

      <p className="text-sm font-medium text-foreground/90 leading-snug mb-4">{event.action}</p>

      <div className="flex items-center gap-5 pt-3 border-t border-border/30">
        <button
          onClick={handleInspiring}
          className={`group flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors ${
            likedBy.inspiring ? 'text-rose-400' : 'text-muted-foreground hover:text-rose-400'
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform group-active:scale-125 ${likedBy.inspiring ? 'fill-rose-400' : ''}`}
          />
          Inspirant{' '}
          <span className="opacity-60 font-normal">{event.likes + (likedBy.inspiring ? 1 : 0)}</span>
        </button>
        <button
          onClick={handleBravo}
          className={`group flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors ${
            likedBy.bravo ? 'text-lime-400' : 'text-muted-foreground hover:text-lime-400'
          }`}
        >
          <Leaf
            className={`h-4 w-4 transition-transform group-active:scale-125 ${likedBy.bravo ? 'fill-lime-400' : ''}`}
          />
          Bravo <span className="opacity-60 font-normal">{event.bravos + (likedBy.bravo ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  )
}

// ─── Tribe card with collective goal ─────────────────────────────────────────

function TribeCard({ guild }: { guild: Guild }) {
  const goal = TRIBE_GOALS[guild.slug] ?? TRIBE_GOALS.default

  return (
    <Link
      href={`/aventure/guilds/${guild.slug}`}
      prefetch={false}
      className="block shrink-0 w-64 snap-start transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden border-border/70 bg-gradient-to-b from-background to-muted/30 shadow-sm hover:shadow-md transition-all h-full flex flex-col rounded-2xl">
        {/* Header avec nom */}
        <div className="h-14 border-b border-border/60 px-4 flex items-center gap-3 bg-white/5">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-400">
            {guild.name[0]}
          </div>
          <p className="line-clamp-1 text-sm font-bold truncate">{guild.name}</p>
        </div>

        {/* Membres + badge */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="font-bold text-foreground">{(guild.members_count || 0).toLocaleString()}</span>
          </div>
          {guild.is_member ? (
            <Badge variant="secondary" className="bg-background/80 text-[10px] uppercase border-none tracking-widest px-2 py-0.5">
              Membre
            </Badge>
          ) : null}
        </div>

        {/* Jauge collective */}
        <div className="px-4 pb-4">
          <p className="text-[10px] text-muted-foreground mb-1.5 truncate">
            🎯 Objectif : {goal.label}
          </p>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 rounded-full transition-all duration-700"
              style={{ width: `${goal.percent}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-lime-400 mt-1 text-right">{goal.percent}%</p>
        </div>
      </Card>
    </Link>
  )
}

// ─── Main component (Server → Client bridge via props) ────────────────────────

interface AdventureMovementClientProps {
  guilds: Guild[]
}

export function AdventureMovementClient({ guilds }: AdventureMovementClientProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      {/* Mes Tribus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Mes Tribus</h2>
          <Link href="/aventure/guilds" className="text-sm text-primary font-medium hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {guilds.length > 0 ? (
            guilds.map((guild) => <TribeCard key={guild.id} guild={guild} />)
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 w-full shrink-0">
              <Users className="w-8 h-8 text-lime-400 opacity-80" />
              <div>
                <p className="text-foreground font-medium">L&apos;union fait la force</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Rejoignez une tribu pour multiplier votre impact.
                </p>
              </div>
              <Link
                href="/aventure/guilds"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm transition-colors mt-2"
              >
                Explorer les tribus
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Global */}
      <section className="space-y-4 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Impact Global</h2>
          <span className="text-xs text-muted-foreground font-medium bg-white/5 border border-white/10 rounded-full px-3 py-1">
            🟢 En direct
          </span>
        </div>
        <div className="relative z-0 w-full space-y-3">
          {MOCK_IMPACT_FEED.map((event) => (
            <ImpactCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  )
}
