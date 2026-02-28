import { Avatar, AvatarFallback, AvatarImage, Badge, CardContent } from '@make-the-change/core/ui'
import { Crown, Medal, Trophy } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import type { CurrentUserRank, LeaderboardEntry } from './leaderboard-types'

type LeaderboardViewProps = {
  leaders: LeaderboardEntry[]
  currentUserRank: CurrentUserRank | null
}

const podiumMeta = {
  1: {
    icon: Crown,
    ring: 'ring-client-yellow-500/50',
    glow: 'from-client-yellow-500/12 via-transparent to-transparent',
    iconClassName: 'text-client-yellow-500',
    bg: 'bg-client-yellow-500',
    text: 'text-client-yellow-500',
    gradient: 'from-client-yellow-500 to-client-yellow-700',
  },
  2: {
    icon: Medal,
    ring: 'ring-client-slate-400/50',
    glow: 'from-client-slate-400/10 via-transparent to-transparent',
    iconClassName: 'text-client-slate-400',
    bg: 'bg-client-slate-400',
    text: 'text-client-slate-400',
    gradient: 'from-client-slate-400 to-client-slate-600',
  },
  3: {
    icon: Trophy,
    ring: 'ring-client-orange-500/50',
    glow: 'from-client-orange-500/12 via-transparent to-transparent',
    iconClassName: 'text-client-orange-500',
    bg: 'bg-client-orange-500',
    text: 'text-client-orange-500',
    gradient: 'from-client-orange-400 to-client-orange-600',
  },
} as const

function AvatarCircle({
  displayName,
  avatarUrl,
  ringClassName,
}: {
  displayName: string
  avatarUrl: string | null
  ringClassName?: string
}) {
  const fallbackInitial = displayName.trim().slice(0, 1).toUpperCase()

  return (
    <Avatar className={cn('relative h-12 w-12 rounded-full ring-2 ring-border', ringClassName)}>
      <AvatarImage src={avatarUrl || undefined} alt={displayName} className="object-cover" />
      <AvatarFallback className="text-sm font-semibold text-muted-foreground">
        {fallbackInitial}
      </AvatarFallback>
    </Avatar>
  )
}

function ScoreInline({ score }: { score: number }) {
  return (
    <span className="inline-flex items-baseline gap-1 tabular-nums">
      <span className="text-sm font-semibold text-foreground">{formatPoints(score)}</span>
      <span className="text-[11px] font-medium text-muted-foreground">score</span>
    </span>
  )
}

export function LeaderboardView({ leaders, currentUserRank }: LeaderboardViewProps) {
  const podiumLeaders = leaders
    .filter((leader) => leader.rank >= 1 && leader.rank <= 3)
    .sort((a, b) => a.rank - b.rank)

  const listLeaders = leaders.filter((leader) => leader.rank > 3)

  const podiumByRank = new Map(podiumLeaders.map((leader) => [leader.rank, leader]))
  const podiumSlots = [2, 1, 3].map((rank) => podiumByRank.get(rank)).filter(Boolean)

  return (
    <div className="flex h-[calc(100svh-4rem-6rem)] flex-col md:h-[calc(100svh-4rem)]">
      <div
        className="relative flex-1 overflow-hidden bg-background/70 shadow-sm backdrop-blur"
        style={{ paddingBottom: '0px' }}
      >
        <div className="pointer-events-none absolute -top-28 right-[-160px] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[-160px] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--client-white)/0.10),_transparent_55%)]" />

        <CardContent className="relative flex h-full flex-col p-0" style={{ paddingBottom: '0px' }}>
          {/* Top Bar (non-interactive) */}
          <div className="flex items-center justify-between gap-3 border-b bg-background/40 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold tracking-tight">Classement</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Saison
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Global
                </Badge>
              </div>
            </div>
          </div>

          {/* Podium 3D */}
          <div
            className="px-4 pt-4 bg-gradient-to-b from-muted/20 to-transparent"
            style={{ paddingBottom: '0px', marginBottom: '0px' }}
          >
            <div
              className="relative"
              style={{ perspective: '1000px', perspectiveOrigin: '50% 50%', marginBottom: '0px' }}
            >
              <div
                className="relative flex justify-center items-end gap-2 sm:gap-4"
                style={{ transformStyle: 'preserve-3d', marginBottom: '0px', paddingBottom: '0px' }}
              >
                {podiumSlots.map((leader) => {
                  if (!leader) return null
                  const meta = podiumMeta[leader.rank as 1 | 2 | 3]
                  const Icon = meta.icon
                  const isFirst = leader.rank === 1

                  return (
                    <div key={leader.id} className="relative flex flex-col items-center flex-1">
                      {/* Avatar et infos au-dessus du bloc */}
                      <div className="relative z-20 mb-2 flex flex-col items-center">
                        <div className="relative">
                          <div className={cn('relative h-12 w-12', meta.ring)}>
                            <Avatar className="h-12 w-12 ring-2 ring-border">
                              <AvatarImage
                                src={leader.avatarUrl || undefined}
                                alt={leader.displayName}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xs font-semibold text-muted-foreground">
                                {leader.displayName.trim().slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Badge de rang */}
                            <div
                              className={cn(
                                'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-client-white',
                                meta.bg,
                              )}
                            >
                              <Icon className="h-3 w-3 text-client-white" />
                            </div>
                          </div>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-foreground text-center max-w-20 truncate">
                          {leader.displayName}
                        </p>
                        <ScoreInline score={leader.score} />
                        <p className="text-[11px] text-muted-foreground">
                          Portefeuille: {formatPoints(leader.pointsBalance)} pts
                        </p>
                      </div>

                      {/* Bloc de podium 3D */}
                      <div
                        className="relative w-full"
                        style={{
                          transform: 'rotateX(-20deg) translateZ(0)',
                          transformStyle: 'preserve-3d',
                          marginBottom: '0px',
                        }}
                      >
                        {/* Face avant du bloc */}
                        <div
                          className={cn(
                            'relative rounded-t-lg shadow-lg mx-auto',
                            isFirst ? 'h-32' : leader.rank === 2 ? 'h-28' : 'h-24',
                            'w-20 sm:w-24 flex items-center justify-center',
                            'bg-gradient-to-b',
                            meta.gradient,
                          )}
                        >
                          {/* Numéro de rang sur le bloc */}
                          <span className="text-3xl sm:text-4xl font-bold text-client-white/60">
                            {leader.rank}
                          </span>

                          {/* Effet de brillance */}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-client-white/10 to-transparent rounded-t-lg" />
                        </div>

                        {/* Ombre portée */}
                        <div
                          className="absolute bottom-0 left-1 right-1 bg-client-black/15 rounded-full blur-sm"
                          style={{
                            height: isFirst ? '12px' : leader.rank === 2 ? '10px' : '8px',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* List (internal scroll) */}
          <div className="flex-1 min-h-0 ">
            <div className="h-full overflow-y-auto divide-y divide-border/70 border-t -translate-y-1 z-20">
              {currentUserRank ? (
                <div className="sticky top-0 z-10 border-b bg-background/55 px-4 py-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-3 rounded-full border bg-gradient-to-r from-primary/10 via-transparent to-accent/10 px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground">Votre rang</span>
                    <span className="inline-flex items-baseline gap-2 tabular-nums">
                      <span className="text-xs font-semibold text-foreground">
                        #{currentUserRank.rank}
                      </span>
                      <ScoreInline score={currentUserRank.score} />
                      <span className="text-[11px] text-muted-foreground">
                        {formatPoints(currentUserRank.pointsBalance)} pts
                      </span>
                    </span>
                  </div>
                </div>
              ) : null}

              {listLeaders.length > 0 ? (
                listLeaders.map((leader) => (
                  <Link
                    key={leader.id}
                    href={`/profile/${leader.id}`}
                    aria-label={`Voir le profil de ${leader.displayName}`}
                    className={cn(
                      'flex items-center justify-between gap-3 px-4 py-3 transition',
                      '[@media(hover:hover)]:hover:bg-muted/35',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="w-10 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                        #{leader.rank}
                      </div>
                      <AvatarCircle displayName={leader.displayName} avatarUrl={leader.avatarUrl} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {leader.displayName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <ScoreInline score={leader.score} />
                      <span className="text-[11px] text-muted-foreground">
                        {formatPoints(leader.pointsBalance)} pts
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Le reste du classement sera affiché ici.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
