'use client'

import { useState } from 'react'
import { Camera, ChevronUp, Package, TrendingUp, Truck } from 'lucide-react'
import type { ProjectUpdate } from '@/types/project'
import { MobileSheet } from './shared/mobile-sheet'

type ProjectUpdatesFeedProps = {
  updates: ProjectUpdate[]
}

const VISIBLE_LIMIT = 3

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

function UpdateRow({ update, dense = false }: { update: ProjectUpdate; dense?: boolean }) {
  const Icon = update.milestone ? MILESTONE_ICON[update.milestone] : null
  const milestoneLabel = update.milestone ? MILESTONE_LABEL[update.milestone] : null

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
        <span className="inline-flex items-center gap-1.5 text-white/45">
          {Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null}
          {milestoneLabel ?? 'Update'}
        </span>
        <span className="text-white/30">{formatRelativeDate(update.postedAt)}</span>
      </div>

      <h3 className="mt-2 text-[15px] font-bold leading-snug text-white">{update.title}</h3>

      {update.imageUrl ? (
        <img
          src={update.imageUrl}
          alt={update.title}
          className={`mt-3 w-full rounded-2xl object-cover ${dense ? 'aspect-[16/7]' : 'aspect-[16/8]'}`}
        />
      ) : null}

      <p
        className={`mt-3 text-[13px] leading-relaxed text-white/60 ${dense ? 'line-clamp-2' : ''}`}
      >
        {update.body}
      </p>

      {update.authorName ? (
        <p className="mt-2 text-[12px] font-medium text-white/40">— {update.authorName}</p>
      ) : null}
    </li>
  )
}

export function ProjectUpdatesFeed({ updates }: ProjectUpdatesFeedProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (updates.length === 0) {
    return (
      <section>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Nouvelles du terrain
        </p>
        <p className="text-sm leading-relaxed text-white/45">
          Pas encore de nouvelles publiées par le partenaire. Les prochaines informations
          apparaîtront ici dès qu&apos;elles seront disponibles.
        </p>
      </section>
    )
  }

  const visible = updates.slice(0, VISIBLE_LIMIT)
  const hasMore = updates.length > VISIBLE_LIMIT
  const hiddenCount = updates.length - visible.length

  return (
    <>
      <section>
        <div className="mb-3 flex items-end justify-between px-1">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Nouvelles du terrain
          </p>
          <span className="text-[11px] font-semibold text-white/35">
            {updates.length} update{updates.length > 1 ? 's' : ''}
          </span>
        </div>

        <ul className="m-0 list-none divide-y divide-white/[0.06] p-0">
          {visible.map((update) => (
            <UpdateRow key={update.id} update={update} dense />
          ))}
        </ul>

        {hasMore ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-left transition-colors active:bg-white/[0.08]"
          >
            <span className="text-sm font-semibold text-white/75">
              Voir toutes les nouvelles
            </span>
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/45">
              +{hiddenCount}
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        ) : null}
      </section>

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nouvelles du terrain"
      >
        <p className="mb-5 mt-1 text-[13px] leading-relaxed text-white/45">
          Toutes les publications du partenaire sur le terrain.
        </p>
        <ul className="m-0 list-none divide-y divide-white/[0.06] p-0">
          {updates.map((update) => (
            <UpdateRow key={update.id} update={update} />
          ))}
        </ul>
      </MobileSheet>
    </>
  )
}
