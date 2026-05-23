import { CalendarDays, Camera, Package, TrendingUp, Truck } from 'lucide-react'
import type { ProjectUpdate } from '@/types/project'

type ProjectUpdatesFeedProps = {
  updates: ProjectUpdate[]
}

const MILESTONE_META: Record<
  NonNullable<ProjectUpdate['milestone']>,
  { icon: typeof CalendarDays; label: string; color: string }
> = {
  funding: { icon: TrendingUp, label: 'Financement', color: 'text-lime-400' },
  production: { icon: Package, label: 'Production', color: 'text-amber-400' },
  delivery: { icon: Truck, label: 'Livraison', color: 'text-sky-400' },
  reporting: { icon: Camera, label: 'Suivi', color: 'text-teal-400' },
}

function formatRelativeDate(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: diffDays > 365 ? 'numeric' : undefined,
    }).format(date)
  } catch {
    return ''
  }
}

function UpdateCard({ update }: { update: ProjectUpdate }) {
  const milestoneMeta = update.milestone ? MILESTONE_META[update.milestone] : null
  const MilestoneIcon = milestoneMeta?.icon ?? CalendarDays

  return (
    <article className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025]">
      {update.imageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.04]">
          <img
            src={update.imageUrl}
            alt={update.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
          <span className={`inline-flex items-center gap-1.5 ${milestoneMeta?.color ?? 'text-white/40'}`}>
            <MilestoneIcon className="h-3.5 w-3.5" />
            {milestoneMeta?.label ?? 'Update'}
          </span>
          <span className="text-white/35">{formatRelativeDate(update.postedAt)}</span>
        </div>

        <h3 className="mt-2 text-[16px] font-black leading-tight tracking-tight text-white">
          {update.title}
        </h3>

        <p className="mt-2 text-[13px] leading-relaxed text-white/60">{update.body}</p>

        {update.authorName && (
          <p className="mt-3 text-[12px] font-semibold text-white/45">— {update.authorName}</p>
        )}
      </div>
    </article>
  )
}

export function ProjectUpdatesFeed({ updates }: ProjectUpdatesFeedProps) {
  if (updates.length === 0) {
    return (
      <section>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Nouvelles du terrain
        </p>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 text-center">
          <p className="text-[13px] leading-relaxed text-white/45">
            Pas encore de nouvelles publiées pour ce projet.
            <br />
            Soutiens-le et reçois les updates directement du terrain.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-3 flex items-end justify-between px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Nouvelles du terrain
        </p>
        <span className="text-[11px] font-semibold text-white/35">
          {updates.length} update{updates.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </section>
  )
}
