import { Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface BioDexCardProps {
  species: {
    id: string
    name: string
    image: string
    rarity?: string
  }
  variant?: 'unlocked' | 'locked'
  href?: string
  className?: string
}

export function BioDexCard({ species, variant = 'unlocked', href, className }: BioDexCardProps) {
  const isLocked = variant === 'locked'

  const content = (
    <article className="flex flex-col items-center gap-2">
      <div className="w-full aspect-square relative flex items-center justify-center">
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Lock className="h-6 w-6 text-white/50" aria-hidden="true" />
          </div>
        )}
        <img
          src={species.image}
          alt={species.name}
          className={cn(
            "h-full w-full object-contain transition-all duration-700",
            isLocked && "grayscale opacity-40 blur-sm"
          )}
        />
      </div>
      <p className={cn("text-sm font-medium text-center leading-snug", isLocked ? "text-white/40" : "text-white/90")}>
        {species.name}
      </p>
      {isLocked ? (
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          À DÉCOUVRIR
        </p>
      ) : (
        <p className={cn("text-[10px] font-bold uppercase tracking-widest", getRarityTextColor(species.rarity))}>
          {species.rarity || 'COMMUN'}
        </p>
      )}
    </article>
  )

  const wrapperClassName = cn(
    "relative block w-28 shrink-0 snap-center transition-transform duration-150 hover:opacity-80 active:scale-[0.97]",
    className
  )

  if (href) {
    return <Link href={href as any} className={wrapperClassName}>{content}</Link>
  }

  return <button type="button" className={wrapperClassName}>{content}</button>
}

function getRarityTextColor(rarity?: string) {
  const r = rarity?.toUpperCase()
  if (r === 'LÉGENDAIRE' || r === 'CRITIQUE') return 'text-amber-400/80'
  if (r === 'RARE' || r === 'MENACÉE') return 'text-blue-400/70'
  return 'text-emerald-500/60'
}