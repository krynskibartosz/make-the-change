'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectBiodexSheetProps = {
  species: ProjectSpecies[]
  isDonationProject?: boolean
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CR: { label: 'En danger critique', color: 'text-red-400/80' },
  EN: { label: 'En danger', color: 'text-orange-400/80' },
  VU: { label: 'Vulnérable', color: 'text-amber-400/80' },
  NT: { label: 'Quasi menacé', color: 'text-yellow-400/70' },
  LC: { label: 'Préoccupation mineure', color: 'text-emerald-400/70' },
  DD: { label: 'Données insuffisantes', color: 'text-white/40' },
  EW: { label: 'Éteint à l\'état sauvage', color: 'text-red-500/80' },
  EX: { label: 'Éteint', color: 'text-red-600/80' },
}

function isKeySpecies(role: string): boolean {
  const r = role?.toLowerCase() ?? ''
  return r.includes('cle') || r.includes('clé')
}

function cleanRole(role: string): string {
  if (!role) return ''
  return role
    .replace(/\bcle\b/gi, 'clé')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function SpeciesSheetCard({ species }: { species: ProjectSpecies }) {
  const imageUrl = sanitizeImageUrl(species.icon)
  const isKey = isKeySpecies(species.role)
  const statusInfo = STATUS_LABEL[species.status?.toUpperCase()] ?? null
  const roleLabel = cleanRole(species.role)

  return (
    <div className="flex gap-4 border-b border-white/6 py-5 last:border-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white/[0.05]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={species.name}
            className="h-full w-full object-cover opacity-30 blur-[1px]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <Lock className="h-4 w-4 text-white/50" />
        </div>
        {isKey && (
          <div className="absolute left-1 top-1 rounded-full bg-lime-300 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-black">
            Clé
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{species.name}</p>
        {species.scientificName ? (
          <p className="mt-0.5 text-xs italic text-white/35">{species.scientificName}</p>
        ) : null}
        {roleLabel ? (
          <p className="mt-1.5 text-xs text-white/55">{roleLabel}</p>
        ) : null}
        {statusInfo ? (
          <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusInfo.color}`}>
            {statusInfo.label}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectBiodexSheet({ species, isDonationProject = false }: ProjectBiodexSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!species || species.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 text-xs font-semibold text-white/35 transition-colors hover:text-white/60"
      >
        Qu&apos;est-ce que le BioDex ?
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="BioDex du projet">
        {/* Bloc 1 — Concept */}
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/65">
          <p>
            Le BioDex regroupe les êtres vivants associés à ce projet. Ce n&apos;est pas une liste
            exhaustive ni une preuve que chaque espèce est présente ou protégée.
          </p>
          <p>
            C&apos;est une trace pédagogique : elle aide à comprendre quel écosystème ce projet
            cherche à soutenir.
          </p>
        </div>

        {/* Bloc 2 — Mécanique de déverrouillage */}
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Comment débloquer une espèce
          </p>
          <p className="text-sm leading-relaxed text-white/60">
            {isDonationProject
              ? 'En faisant un don à ce projet, vous pouvez débloquer les espèces liées et les ajouter à votre collection BioDex.'
              : 'En soutenant ce projet, vous pouvez débloquer les espèces liées et les ajouter à votre collection BioDex.'}
          </p>
        </div>

        {/* Bloc 3 — Espèces */}
        <div className="mt-6">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            {species.length === 1 ? '1 espèce liée' : `${species.length} espèces liées`}
          </p>
          <div>
            {species.map((sp) => (
              <SpeciesSheetCard key={sp.id} species={sp} />
            ))}
          </div>
        </div>

        {/* Bloc 4 — Disclaimer */}
        <p className="mt-4 pb-2 text-xs leading-relaxed text-white/30">
          Les données de conservation sont issues de l&apos;UICN. Les liens entre espèces et projets
          sont indicatifs. La biodiversité reste variable et dépend du terrain.
        </p>
      </MobileSheet>
    </>
  )
}
