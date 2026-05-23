import { Camera, Package, TrendingUp, Truck } from 'lucide-react'
import type { ProjectUpdate } from '@/types/project'

type ProjectUpdatesFeedProps = {
  updates: ProjectUpdate[]
}

const MILESTONE_LABEL: Record<NonNullable<ProjectUpdate['milestone']>, string> = {
  funding: 'Financement',
  production: 'Production',
  delivery: 'Livraison',
  reporting: 'Suivi',
}

const MILESTONE_ICON: Record<
  NonNullable<ProjectUpdate['milestone']>,
  typeof TrendingUp
> = {
  funding: TrendingUp,
  production: Package,
  delivery: Truck,
  reporting: Camera,
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

export function ProjectUpdatesFeed({ updates }: ProjectUpdatesFeedProps) {
  if (updates.length === 0) {
    return (
      <section>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Nouvelles du terrain
        </p>
        <p className="text-sm leading-relaxed text-white/45">
          Pas encore de nouvelles publiées pour ce projet. Soutiens-le et reçois les
          updates directement du terrain.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Nouvelles du terrain
      </p>
      <p className="mb-4 text-sm leading-relaxed text-white/45">
        Les dernières publications du partenaire sur le terrain.
      </p>

      <ul className="m-0 list-none divide-y divide-white/[0.06] p-0">
        {updates.map((update) => {
          const Icon = update.milestone ? MILESTONE_ICON[update.milestone] : null
          const milestoneLabel = update.milestone ? MILESTONE_LABEL[update.milestone] : null

          return (
            <li key={update.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
                <span className="inline-flex items-center gap-1.5 text-white/45">
                  {Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null}
                  {milestoneLabel ?? 'Update'}
                </span>
                <span className="text-white/30">{formatRelativeDate(update.postedAt)}</span>
              </div>

              <h3 className="mt-2 text-[15px] font-bold leading-snug text-white">
                {update.title}
              </h3>

              {update.imageUrl ? (
                <img
                  src={update.imageUrl}
                  alt={update.title}
                  className="mt-3 aspect-[16/9] w-full rounded-2xl object-cover"
                />
              ) : null}

              <p className="mt-3 text-[13px] leading-relaxed text-white/60">{update.body}</p>

              {update.authorName ? (
                <p className="mt-2 text-[12px] font-medium text-white/40">
                  — {update.authorName}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
