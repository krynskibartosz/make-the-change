'use client'

import { useState } from 'react'
import { Leaf } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MobileSheet } from '../shared/mobile-sheet'

type ProjectBiodexSheetProps = {
  species: ProjectSpecies[]
  isDonationProject?: boolean
}

const SPECIES_THUMBNAILS: Record<string, string> = {
  'species-abeille-noire': '/images/species-thumbnails/abeille-noire.png',
  'species-indri': '/images/species-thumbnails/indri.png',
  'species-sifaka-diademe': '/images/species-thumbnails/sifaka-diademe.png',
  'species-vari-noir-blanc': '/images/species-thumbnails/vari-noir-blanc.png',
  'species-cameleon-parson': '/images/species-thumbnails/cameleon-parson.png',
  'species-cameleon-panthere': '/images/species-thumbnails/cameleon-panthere.png',
  'species-charancon-girafe': '/images/species-thumbnails/charancon-girafe.png',
  'species-grenouille-tomate': '/images/species-thumbnails/grenouille-tomate.png',
  'species-martin-chasseur-pygme': '/images/species-thumbnails/martin-chasseur-pygmee.png',
  'species-coua-bleu': '/images/species-thumbnails/coua-bleu.png',
  'species-gecko-diurne': '/images/species-thumbnails/gecko-diurne.png',
  'species-chouette-cheveche': '/images/species-thumbnails/chouette-cheveche.png',
  'species-liotrigona-bitika': '/images/species-thumbnails/liotrigona-bitika.png',
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CR: { label: 'En danger critique', color: 'text-red-400/80' },
  EN: { label: 'En danger', color: 'text-orange-400/80' },
  VU: { label: 'Vulnérable', color: 'text-amber-400/80' },
  NT: { label: 'Quasi menacé', color: 'text-yellow-400/70' },
  LC: { label: 'Préoccupation mineure', color: 'text-emerald-400/70' },
  DD: { label: 'Données insuffisantes', color: 'text-white/35' },
  EW: { label: 'Éteint à l\'état sauvage', color: 'text-red-500/80' },
  EX: { label: 'Éteint', color: 'text-red-600/80' },
}

function getSpeciesImageUrl(species: ProjectSpecies): string | null {
  return SPECIES_THUMBNAILS[species.id] ?? sanitizeImageUrl(species.icon)
}

function isKeySpecies(role: string): boolean {
  const r = role?.toLowerCase() ?? ''
  return r.includes('cle') || r.includes('clé')
}

function cleanRole(role: string): string {
  if (!role) return ''
  const corrected = role
    .replace(/\bespece\b/gi, 'espèce')
    .replace(/\bcle\b/gi, 'clé')
    .toLowerCase()
  return corrected.charAt(0).toUpperCase() + corrected.slice(1)
}

function SheetSpeciesRow({ species }: { species: ProjectSpecies }) {
  const imageUrl = getSpeciesImageUrl(species)
  const isKey = isKeySpecies(species.role)
  const statusInfo = STATUS_LABEL[species.status?.toUpperCase()] ?? null

  return (
    <div className="flex gap-3 border-b border-white/[0.06] py-3.5 last:border-0">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${species.name}, ${isKey ? 'espèce clé liée au projet' : 'espèce associée'}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
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
          {!isKey ? (
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/40">
              Espèce associée
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

  const visibleSecondary = remainingSpecies.slice(0, 3)
  const hiddenCount = remainingSpecies.length - visibleSecondary.length

  const sectionSubtitle =
    species.length === 1
      ? "1 espèce pour comprendre l'écosystème du projet"
      : `${species.length} espèces pour comprendre l'écosystème du projet`

  const featuredImageUrl = featuredSpecies ? getSpeciesImageUrl(featuredSpecies) : null
  const featuredRole = featuredSpecies ? cleanRole(featuredSpecies.role) : ''

  return (
    <>
      {/* ── Titre + sous-titre ── */}
      <div className="mb-4">
        <p className="text-[18px] font-black leading-none tracking-[-0.03em] text-white">
          Espèces liées au projet
        </p>
        <p className="mt-1 text-[12px] leading-snug text-white/50">{sectionSubtitle}</p>
      </div>

      {/* ── Carte espèce clé ── */}
      {featuredSpecies ? (
        <div className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-white/[0.04] p-3">
          <div className="h-[96px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
            {featuredImageUrl ? (
              <img
                src={featuredImageUrl}
                alt={`${featuredSpecies.name}, espèce clé liée au projet`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black leading-tight text-white">{featuredSpecies.name}</p>
            {featuredRole ? (
              <p className="mt-0.5 text-[13px] text-lime-400/80">{featuredRole}</p>
            ) : null}
            <span className="mt-2 inline-flex rounded-full bg-lime-300/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime-300">
              ESPÈCE CLÉ
            </span>
            <div className="mt-2 flex items-center gap-1">
              <Leaf className="h-3 w-3 shrink-0 text-white/30" />
              <p className="text-[11px] text-white/35">Espèce liée au projet</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Autres espèces associées ── */}
      {remainingSpecies.length > 0 ? (
        <div className="mt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
            Autres espèces associées
          </p>
          <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-5 sm:px-5">
            <div className="flex gap-3 pr-4">
              {visibleSecondary.map((sp) => {
                const imgUrl = getSpeciesImageUrl(sp)
                return (
                  <div key={sp.id} className="flex w-[80px] shrink-0 flex-col">
                    <div className="h-[80px] w-[80px] overflow-hidden rounded-xl bg-white/[0.04]">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`${sp.name}, espèce associée`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-semibold leading-snug text-white/55">
                      {sp.name}
                    </p>
                  </div>
                )
              })}

              {hiddenCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="flex w-[80px] shrink-0 flex-col items-center"
                  aria-label={`Voir les ${hiddenCount} autres espèces associées`}
                >
                  <div className="flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] transition-colors hover:bg-white/[0.06] active:bg-white/[0.08]">
                    <Leaf className="h-4 w-4 text-lime-400/50" />
                    <span className="text-[13px] font-black leading-none text-white/60">+{hiddenCount}</span>
                    <span className="text-[10px] text-white/35">espèces</span>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Sheet de détail ── */}
      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Espèces liées au projet">
        <p className="mt-1 text-sm text-white/50">
          {species.length === 1
            ? "1 espèce pour comprendre l'écosystème associé à ce projet."
            : `${species.length} espèces pour comprendre l'écosystème associé à ce projet.`}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/35">
          Leur présence dépend du terrain, des données disponibles et du niveau de documentation.
        </p>

        <div className="mt-4">
          {[featuredSpecies, ...remainingSpecies].filter(Boolean).map((sp) => (
            <SheetSpeciesRow key={sp!.id} species={sp!} />
          ))}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-white/30">
          {isDonationProject
            ? 'En faisant un don, certaines espèces peuvent être ajoutées à votre collection BioDex.'
            : 'En soutenant ce projet, certaines espèces peuvent être ajoutées à votre collection BioDex.'}
        </p>

        <p className="mt-3 pb-2 text-[11px] leading-relaxed text-white/25">
          Ces espèces aident à comprendre l&apos;écosystème associé au projet. Elles ne constituent
          pas une preuve de protection individuelle. Statuts de conservation : UICN.
        </p>
      </MobileSheet>
    </>
  )
}
