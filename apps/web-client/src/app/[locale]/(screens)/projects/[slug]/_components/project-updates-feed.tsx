'use client'

import { useState } from 'react'
import { Camera, ChevronUp, Package, TrendingUp, Truck } from 'lucide-react'
import type { ProjectUpdate } from '@/types/project'
import { MobileSheet } from './shared/mobile-sheet'

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

function UpdateRow({ update }: { update: ProjectUpdate }) {
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
          className="mt-3 aspect-[16/8] w-full rounded-2xl object-cover"
        />
      ) : null}

      <p className="mt-3 text-[13px] leading-relaxed text-white/60">{update.body}</p>

      {update.authorName ? (
        <p className="mt-2 text-[12px] font-medium text-white/40">— {update.authorName}</p>
      ) : null}
    </li>
  )
}

export function ProjectUpdatesFeed({ updates }: ProjectUpdatesFeedProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Pas d'updates → on ne montre rien sur la page projet.
  // Le suivi ne doit pas occuper d'espace tant qu'il n'a rien à dire.
  if (updates.length === 0) {
    return null
  }

  const latest = updates[0]

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <Camera className="h-4 w-4 shrink-0 text-white/45" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-white/70">
            {updates.length} nouvelle{updates.length > 1 ? 's' : ''} du terrain
          </span>
          <span className="line-clamp-1 text-xs text-white/35">
            {latest?.title} · {latest ? formatRelativeDate(latest.postedAt) : ''}
          </span>
        </div>
        <ChevronUp className="h-4 w-4 shrink-0 text-white/25" />
      </button>

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nouvelles du terrain"
      >
        <p className="mb-5 mt-1 text-[13px] leading-relaxed text-white/45">
          Publications du partenaire sur le terrain.
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
