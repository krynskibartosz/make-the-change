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

const MILESTONE_ICON: Record<NonNullable<ProjectUpdate['milestone']>, typeof TrendingUp> = {
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

function formatAbsoluteDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function MilestonePill({ update }: { update: ProjectUpdate }) {
  const Icon = update.milestone ? MILESTONE_ICON[update.milestone] : Camera
  const milestoneLabel = update.milestone ? MILESTONE_LABEL[update.milestone] : 'Update'

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.055] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {milestoneLabel}
    </span>
  )
}

function LatestUpdate({ update }: { update: ProjectUpdate }) {
  return (
    <article className="border-b border-white/[0.08] pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MilestonePill update={update} />
        <time className="text-[11px] font-bold text-white/35" dateTime={update.postedAt}>
          {formatRelativeDate(update.postedAt)}
        </time>
      </div>

      <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white">
        {update.title}
      </h2>

      {update.imageUrl ? (
        <img
          src={update.imageUrl}
          alt={update.title}
          className="mt-4 aspect-[16/9] w-full object-cover"
        />
      ) : null}

      <p className="mt-4 text-[14px] leading-relaxed text-white/62">{update.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/35">
        {update.authorName ? <span className="font-bold text-white/45">{update.authorName}</span> : null}
        <time dateTime={update.postedAt}>{formatAbsoluteDate(update.postedAt)}</time>
      </div>
    </article>
  )
}

function TimelineUpdate({ update, isLast }: { update: ProjectUpdate; isLast: boolean }) {
  return (
    <li className="grid grid-cols-[22px_minmax(0,1fr)] gap-4">
      <div className="relative pt-1">
        <span className="block h-2.5 w-2.5 rounded-full bg-lime-300/80 shadow-[0_0_14px_rgba(190,242,100,0.35)]" />
        {!isLast ? (
          <span className="absolute left-[4.5px] top-5 h-[calc(100%+1.25rem)] w-px bg-white/[0.08]" />
        ) : null}
      </div>
      <article className="pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <MilestonePill update={update} />
          <time className="text-[11px] font-bold text-white/30" dateTime={update.postedAt}>
            {formatRelativeDate(update.postedAt)}
          </time>
        </div>
        <h3 className="mt-3 text-[16px] font-black leading-snug text-white">{update.title}</h3>
        {update.imageUrl ? (
          <img
            src={update.imageUrl}
            alt={update.title}
            className="mt-3 aspect-[16/8] w-full object-cover"
          />
        ) : null}
        <p className="mt-3 text-[13px] leading-relaxed text-white/56">{update.body}</p>
        {update.authorName ? (
          <p className="mt-2 text-[12px] font-medium text-white/36">{update.authorName}</p>
        ) : null}
      </article>
    </li>
  )
}

export function ProjectUpdatesFeed({ updates }: ProjectUpdatesFeedProps) {
  if (updates.length === 0) {
    return (
      <section>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Actualites
        </p>
        <div className="border-y border-white/[0.08] py-6">
          <Camera className="h-5 w-5 text-white/35" aria-hidden="true" />
          <p className="mt-3 text-lg font-black text-white">Premieres nouvelles a venir</p>
          <p className="mt-2 text-sm leading-relaxed text-white/48">
            Les prochaines publications terrain apparaitront ici des que le partenaire les publiera.
          </p>
        </div>
      </section>
    )
  }

  const [latest, ...previousUpdates] = updates
  if (!latest) return null

  return (
    <section>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Actualites
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white">Nouvelles du terrain</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/48">
          Les preuves recentes du projet: suivi, production, livraison et observations terrain.
        </p>
      </div>

      <LatestUpdate update={latest} />

      {previousUpdates.length > 0 ? (
        <ol className="mt-6 list-none p-0">
          {previousUpdates.map((update, index) => (
            <TimelineUpdate
              key={update.id}
              update={update}
              isLast={index === previousUpdates.length - 1}
            />
          ))}
        </ol>
      ) : null}
    </section>
  )
}
