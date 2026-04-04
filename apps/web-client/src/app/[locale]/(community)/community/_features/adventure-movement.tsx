import { Badge, Card, CardTitle } from '@make-the-change/core/ui'
import { Heart, Users, Leaf } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getGuilds } from '@/lib/social/feed.reads'
import { GuildAvatar, GuildCover } from '@/app/[locale]/(community)/community/guilds/_features/guild-visuals'
import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'

// ─── Mock Impact Feed ─────────────────────────────────────────────────────────
// Données simulant une communauté vivante et diversifiée.
// À remplacer par un vrai feed temps-réel quand l'API sera prête.

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
    action: '🤝 A rejoint la Guilde Agroforest Pioneers',
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
    action: '🦅 A découvert l\'Aigle de Bonelli dans le BioDex',
    likes: 57,
    bravos: 19,
    avatarColor: 'bg-cyan-500/20 text-cyan-400',
  },
]

export async function AdventureMovement() {
  const t = await getTranslations('community')
  
  const guilds = await getGuilds(6)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      {/* Guilds Horizontal Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Mes Guildes</h2>
          <Link href="/community/guilds" className="text-sm text-primary font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        
        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {guilds.length > 0 ? (
            guilds.map((guild) => (
              <Link
                key={guild.id}
                href={`/community/guilds/${guild.slug}`}
                prefetch={false}
                className="block shrink-0 w-64 snap-start transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="overflow-hidden border-border/70 bg-linear-to-b from-background to-muted/30 shadow-sm hover:shadow-md transition-all h-full flex flex-col rounded-2xl">
                  <GuildCover
                    name={guild.name}
                    bannerUrl={guild.banner_url}
                    className="h-16 border-b border-border/60 px-3 py-2 flex-none"
                  >
                    <div className="flex items-center gap-2">
                       <GuildAvatar
                          name={guild.name}
                          logoUrl={guild.logo_url}
                          className="h-10 w-10 border-white/30 bg-background/90 shrink-0 shadow-sm"
                          fallbackClassName="bg-emerald-500/20 text-emerald-50"
                        />
                         <CardTitle className="line-clamp-1 text-sm text-white shadow-sm font-bold">
                          {guild.name}
                        </CardTitle>
                    </div>
                  </GuildCover>
                  <div className="p-3 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-bold text-foreground">{(guild.members_count || 0).toLocaleString()}</span>
                    </div>
                    {guild.is_member ? <Badge variant="secondary" className="bg-background/80 text-[10px] uppercase border-none tracking-widest px-2 py-0.5">Membre</Badge> : null}
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 w-full shrink-0">
              <Users className="w-8 h-8 text-lime-400 opacity-80" />
              <div>
                <p className="text-foreground font-medium">L&apos;union fait la force</p>
                <p className="text-sm text-muted-foreground mt-1">Rejoignez une tribu pour multiplier votre impact.</p>
              </div>
              <Link
                href="/community/guilds"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm transition-colors mt-2"
              >
                Explorer les guildes
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stream — Mock feed riche et diversifié */}
      <section className="space-y-4 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Impact Global</h2>
          <span className="text-xs text-muted-foreground font-medium bg-white/5 border border-white/10 rounded-full px-3 py-1">
            🟢 En direct
          </span>
        </div>
        <div className="relative z-0 w-full space-y-3">
          {MOCK_IMPACT_FEED.map((event) => (
            <div
              key={event.id}
              className="bg-card dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-border/50 hover:bg-muted/30 transition-colors duration-200"
            >
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

              <p className="text-sm font-medium text-foreground/90 leading-snug mb-4">
                {event.action}
              </p>

              {/* Interaction buttons - encouragement only */}
              <div className="flex items-center gap-5 pt-3 border-t border-border/30">
                <button className="group flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground hover:text-rose-400 transition-colors">
                  <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Inspirant <span className="opacity-60 font-normal">{event.likes}</span>
                </button>
                <button className="group flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground hover:text-lime-400 transition-colors">
                  <Leaf className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Bravo <span className="opacity-60 font-normal">{event.bravos}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
