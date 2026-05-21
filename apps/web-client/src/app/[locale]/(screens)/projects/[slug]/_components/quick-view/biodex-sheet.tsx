'use client'

import { useState } from 'react'
import { ChevronRight, Lock } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MobileSheet } from '../shared/mobile-sheet'

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
  DD: { label: 'Statut à documenter', color: 'text-white/35' },
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

function FeaturedSpeciesCard({
  species,
  isDonationProject,
}: {
  species: ProjectSpecies
  isDonationProject: boolean
}) {
  const imageUrl = sanitizeImageUrl(species.icon)
  const isKey = isKeySpecies(species.role)
  const statusInfo = STATUS_LABEL[species.status?.toUpperCase()] ?? null
  const roleLabel = cleanRole(species.role)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.05]">
      {imageUrl ? (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080F]/90 via-[#08080F]/60 to-transparent" />
        </div>
      ) : null}

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/[0.08]">
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
              <Lock className="h-3.5 w-3.5 text-white/50" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                isKey
                  ? 'bg-lime-300 text-black'
                  : 'bg-white/[0.08] text-white/40'
              }`}
            >
              {isKey ? 'Espèce clé' : 'Espèce liée'}
            </span>
            <p className="mt-1.5 text-base font-black text-white">{species.name}</p>
            {species.scientificName ? (
              <p className="text-xs italic text-white/35">{species.scientificName}</p>
            ) : null}
          </div>
        </div>

        {roleLabel ? (
          <p className="mt-3 text-sm text-white/55">{roleLabel}</p>
        ) : null}
        {statusInfo ? (
          <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusInfo.color}`}>
            {statusInfo.label}
          </p>
        ) : null}
        <p className="mt-3 text-[11px] text-white/30">
          {isDonationProject
            ? 'Débloquable en faisant un don à ce projet'
            : 'Débloquable en soutenant ce projet'}
        </p>
      </div>
    </div>
  )
}

function SpeciesListItem({ species }: { species: ProjectSpecies }) {
  const imageUrl = sanitizeImageUrl(species.icon)
  const isKey = isKeySpecies(species.role)
  const statusInfo = STATUS_LABEL[species.status?.toUpperCase()] ?? null
  const roleLabel = cleanRole(species.role)
  const roleChip = !isKey && roleLabel ? roleLabel.split(' ').slice(0, 3).join(' ') : null

  return (
    <div className="flex gap-3 border-b border-white/[0.06] py-3.5 last:border-0">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
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
          <Lock className="h-3 w-3 text-white/45" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white">{species.name}</p>
          {isKey ? (
            <span className="shrink-0 rounded-full bg-lime-300/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-lime-300/80">
              Clé
            </span>
          ) : null}
        </div>
        {species.scientificName ? (
          <p className="mt-0.5 text-[11px] italic text-white/30">{species.scientificName}</p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {roleChip ? (
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/40">
              {roleChip}
            </span>
          ) : null}
          {statusInfo ? (
            <span className={`text-[10px] font-bold uppercase tracking-[0.06em] ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function ProjectBiodexSheet({ species, isDonationProject = false }: ProjectBiodexSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!species || species.length === 0) return null

  const featuredSpecies = species.find((sp) => isKeySpecies(sp.role)) ?? species[0]
  const remainingSpecies = featuredSpecies
    ? species.filter((sp) => sp.id !== featuredSpecies.id)
    : species

  const keySpecies = species.filter((sp) => isKeySpecies(sp.role))
  const safePrimary = keySpecies.length > 0 ? keySpecies : species.slice(0, 1)
  const associated = species.filter((sp) => !safePrimary.some((p) => p.id === sp.id))
  const sectionSubtitle =
    (safePrimary.length > 1 ? `${safePrimary.length} espèces clés` : '1 espèce clé') +
    (associated.length > 0 ? ` · ${associated.length} associée${associated.length > 1 ? 's' : ''}` : '')

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mb-3 flex w-full items-center justify-between text-left transition-opacity hover:opacity-75 active:opacity-60"
      >
        <div>
          <p className="text-[18px] font-black leading-none tracking-[-0.03em] text-white">
            Espèces liées au projet
          </p>
          <p className="mt-1 text-[12px] leading-snug text-white/50">{sectionSubtitle}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/30" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Espèces liées au projet">
        {/* Subtitle + intro court */}
        <p className="mt-1 text-sm text-white/50">
          {species.length === 1
            ? '1 espèce liée à cet écosystème'
            : `${species.length} espèces liées à cet écosystème`}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/35">
          Ces espèces aident à comprendre le vivant associé au projet. Leur présence dépend du
          terrain et des données disponibles.
        </p>

        {/* Espèce mise en avant */}
        {featuredSpecies ? (
          <div className="mt-4">
            <FeaturedSpeciesCard species={featuredSpecies} isDonationProject={isDonationProject} />
          </div>
        ) : null}

        {/* Carte déverrouillage — compacte */}
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400/10">
            <Lock className="h-3.5 w-3.5 text-lime-400/70" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/80">
              {isDonationProject ? 'En faisant un don' : 'En soutenant ce projet'}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/45">
              Vous pouvez ajouter ces espèces à votre collection BioDex.
            </p>
          </div>
        </div>

        {/* Liste des espèces restantes */}
        {remainingSpecies.length > 0 ? (
          <div className="mt-5">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              {remainingSpecies.length} autre{remainingSpecies.length > 1 ? 's' : ''} espèce
              {remainingSpecies.length > 1 ? 's' : ''}
            </p>
            <div>
              {remainingSpecies.map((sp) => (
                <SpeciesListItem key={sp.id} species={sp} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Disclaimer — minimal, en bas */}
        <p className="mt-4 pb-2 text-[11px] leading-relaxed text-white/25">
          Ces espèces ne constituent pas une preuve de protection individuelle. Données de conservation
          issues de l&apos;UICN.
        </p>
      </MobileSheet>
    </>
  )
}
