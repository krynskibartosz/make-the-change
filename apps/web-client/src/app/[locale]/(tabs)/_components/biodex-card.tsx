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
    <article>
      {isLocked && (
        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/30">
          <Lock className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
        </span>
      )}
      {isLocked ? (
        <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/40">
          Verrouillé
        </span>
      ) : (
        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
          {species.rarity || 'COMMUN'}
        </span>
      )}
      <div className={cn("mt-3 aspect-square overflow-hidden rounded-xl", isLocked ? "bg-black/30" : "bg-black/20")}>
        <img
          src={species.image}
          alt={species.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            isLocked && "scale-105 grayscale contrast-125 opacity-40 blur-[2px]"
          )}
        />
      </div>
      <p className={cn("mt-3 text-sm line-clamp-2 min-h-[2.5rem]", isLocked ? "font-semibold text-white/60" : "font-bold text-white")}>
        {species.name}
      </p>
    </article>
  )

  const wrapperClassName = cn(
    "relative block w-40 shrink-0 snap-center rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-opacity hover:opacity-80 active:scale-[0.98]",
    className
  )

  if (href) {
    return <Link href={href as any} className={wrapperClassName}>{content}</Link>
  }

  return <button type="button" className={wrapperClassName}>{content}</button>
}