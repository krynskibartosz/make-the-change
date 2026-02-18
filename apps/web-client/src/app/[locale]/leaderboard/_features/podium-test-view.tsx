import { Badge } from '@make-the-change/core/ui'
import { Crown, Medal, Trophy } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import type { CurrentUserRank, LeaderboardEntry } from './leaderboard-types'

type PodiumTestViewProps = {
  leaders: LeaderboardEntry[]
  currentUserRank: CurrentUserRank | null
}

const podiumMeta = {
  1: {
    icon: Crown,
    ring: 'ring-client-amber-200/50',
    glow: 'from-client-amber-500/12 via-transparent to-transparent',
    iconClassName: 'text-client-amber-300',
    blockHeight: 'h-32',
    blockColor: 'from-client-amber-500 to-client-orange-800',
  },
  2: {
    icon: Medal,
    ring: 'ring-client-slate-200/40',
    glow: 'from-client-slate-200/10 via-transparent to-transparent',
    iconClassName: 'text-client-slate-200',
    blockHeight: 'h-24',
    blockColor: 'from-client-slate-600 to-client-slate-800',
  },
  3: {
    icon: Trophy,
    ring: 'ring-client-orange-200/40',
    glow: 'from-client-orange-300/12 via-transparent to-transparent',
    iconClassName: 'text-client-orange-200',
    blockHeight: 'h-20',
    blockColor: 'from-client-orange-600 to-client-orange-800',
  },
} as const

function AvatarCircle({
  displayName,
  avatarUrl,
  ringClassName,
  rank,
}: {
  displayName: string
  avatarUrl: string | null
  ringClassName?: string
  rank: number
}) {
  return (
    <div className="relative">
      <div className={cn('relative h-16 w-16 rounded-full ring-2 ring-border', ringClassName)}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            {displayName.trim().slice(0, 1).toUpperCase()}
          </div>
        )}
        {/* Badge de rang */}
        <div className={cn(
          'absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
          rank === 1 && 'bg-client-yellow-500 text-client-white',
          rank === 2 && 'bg-client-gray-400 text-client-white', 
          rank === 3 && 'bg-client-orange-400 text-client-white'
        )}>
          {rank}
        </div>
      </div>
    </div>
  )
}

function PointsInline({ points }: { points: number }) {
  return (
    <span className="inline-flex items-baseline gap-1 tabular-nums">
      <span className="text-sm font-semibold text-foreground">{formatPoints(points)}</span>
      <span className="text-[11px] font-medium text-muted-foreground">pts</span>
    </span>
  )
}

export function PodiumTestView({ leaders, currentUserRank }: PodiumTestViewProps) {
  const podiumLeaders = leaders
    .filter((leader) => leader.rank >= 1 && leader.rank <= 3)
    .sort((a, b) => a.rank - b.rank)

  // Ordre d'affichage : 2ème, 1er, 3ème
  const displayOrder = [2, 1, 3]
  const podiumByRank = new Map(podiumLeaders.map((leader) => [leader.rank, leader]))
  const podiumSlots = displayOrder.map((rank) => podiumByRank.get(rank)).filter(Boolean)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-8">Podium 3D Test</h1>
        
        {/* Conteneur 3D avec perspective */}
        <div className="relative" style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}>
          <div className="relative flex justify-center items-end gap-8 pb-8" style={{ transformStyle: 'preserve-3d' }}>
            
            {podiumSlots.map((leader) => {
              if (!leader) return null
              const meta = podiumMeta[leader.rank as 1 | 2 | 3]
              const Icon = meta.icon
              const isFirst = leader.rank === 1

              return (
                <div
                  key={leader.id}
                  className="relative flex flex-col items-center"
                >
                  {/* Avatar et infos au-dessus du bloc */}
                  <div className="relative z-20 mb-4 flex flex-col items-center">
                    <AvatarCircle
                      displayName={leader.displayName}
                      avatarUrl={leader.avatarUrl}
                      ringClassName={meta.ring}
                      rank={leader.rank}
                    />
                    <p className="mt-2 text-sm font-semibold text-foreground text-center max-w-20 truncate">
                      {leader.displayName}
                    </p>
                    <PointsInline points={leader.points} />
                  </div>

                  {/* Bloc de podium 3D */}
                  <div 
                    className="relative"
                    style={{
                      transform: 'rotateX(-20deg) translateZ(0)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Face avant du bloc */}
                    <div
                      className={cn(
                        'relative rounded-t-lg shadow-2xl',
                        meta.blockHeight,
                        'w-24 flex items-center justify-center',
                        leader.rank === 1 && 'bg-gradient-to-b from-client-yellow-500 to-client-yellow-700',
                        leader.rank === 2 && 'bg-gradient-to-b from-client-gray-400 to-client-gray-600',
                        leader.rank === 3 && 'bg-gradient-to-b from-client-orange-400 to-client-orange-600'
                      )}
                    >
                      {/* Numéro de rang sur le bloc */}
                      <span className="text-4xl font-bold text-client-white/20">
                        {leader.rank}
                      </span>
                      
                      {/* Effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-client-white/10 to-transparent rounded-t-lg" />
                    </div>
                    
                    {/* Ombre portée */}
                    <div 
                      className="absolute -bottom-2 left-2 right-2 h-4 bg-client-black/20 rounded-full blur-md" 
                      style={{
                        height: leader.rank === 1 ? '16px' : leader.rank === 2 ? '12px' : '10px'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Votre rang si connecté */}
        {currentUserRank && (
          <div className="mt-16 p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Votre rang</span>
              <span className="inline-flex items-baseline gap-2 tabular-nums">
                <span className="text-sm font-semibold text-foreground">
                  #{currentUserRank.rank}
                </span>
                <PointsInline points={currentUserRank.points} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
