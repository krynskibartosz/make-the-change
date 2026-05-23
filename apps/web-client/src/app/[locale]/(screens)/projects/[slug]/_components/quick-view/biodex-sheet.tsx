'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MobileSheet } from '../shared/mobile-sheet'

type ProjectBiodexSheetProps = {
  species: ProjectSpecies[]
  projectType?: string | null
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
  EW: { label: "Éteint à l'état sauvage", color: 'text-red-500/80' },
  EX: { label: 'Éteint', color: 'text-red-600/80' },
}

type CycleStep = { label: string; description: string }

type ProjectCycle = {
  subtitle: string
  narrative: string
  steps: [CycleStep, CycleStep, CycleStep, CycleStep]
}

function getProjectCycle(projectType: string | null | undefined): ProjectCycle {
  const t = projectType?.toLowerCase() ?? ''

  if (t.includes('reef') || t.includes('coral') || t.includes('ocean')) {
    return {
      subtitle: 'Des fragments aux récifs, découvrez ce que votre soutien rend possible.',
      narrative:
        "Votre soutien finance la transplantation de fragments de corail sur des récifs dégradés. Ces fragments, soigneusement préparés, relancent une zone vivante et offrent progressivement abri et nourriture à la faune marine.",
      steps: [
        {
          label: 'Fragments préparés',
          description:
            'Des fragments de corail sont sélectionnés et fixés sur des structures adaptées.',
        },
        {
          label: 'Coraux implantés',
          description: 'Les fragments sont installés sur le récif pour relancer une zone vivante.',
        },
        {
          label: 'Habitat recréé',
          description:
            'Les coraux offrent progressivement abri et support à de nombreuses espèces marines.',
        },
        {
          label: 'Récif suivi',
          description:
            "L'équipe observe la croissance, la survie et l'évolution de la zone restaurée.",
        },
      ],
    }
  }

  if (t.includes('orchard') || t.includes('olive')) {
    return {
      subtitle: 'Des arbres aux huiles, découvrez ce que votre soutien rend possible.',
      narrative:
        "Votre soutien accompagne des oliviers cultivés par des producteurs locaux. Les arbres sont entretenus pour préserver leur vitalité, leurs olives récoltées au bon moment et leur huile valorisée pour soutenir une filière durable.",
      steps: [
        {
          label: 'Oliviers accompagnés',
          description:
            'Les arbres sont entretenus pour préserver leur vitalité et leur production.',
        },
        {
          label: 'Sols vivants',
          description:
            "Le travail du terrain soutient l'équilibre entre racines, eau et biodiversité locale.",
        },
        {
          label: 'Olives récoltées',
          description: 'Les fruits sont cueillis au bon moment pour préserver leur qualité.',
        },
        {
          label: 'Huile valorisée',
          description: 'La production est transformée et vendue pour soutenir le producteur.',
        },
      ],
    }
  }

  return {
    subtitle: 'Des ruches aux fleurs, découvrez ce que votre soutien rend possible.',
    narrative:
      "Votre soutien accompagne des ruches gérées par des apiculteurs locaux. Les abeilles y trouvent un habitat suivi, butinent les fleurs du territoire et permettent la production d'un miel ensuite valorisé par le partenaire.",
    steps: [
      { label: 'Ruches accompagnées', description: 'Un habitat suivi pour les colonies.' },
      { label: 'Abeilles actives', description: 'Elles butinent autour du rucher.' },
      { label: 'Fleurs mellifères', description: 'Elles fournissent nectar et pollen.' },
      {
        label: 'Miel valorisé',
        description: 'La production soutient les apiculteurs locaux.',
      },
    ],
  }
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

function formatCommonName(name: string): string {
  if (!name) return ''
  const lower = name.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function SheetSpeciesRow({ species }: { species: ProjectSpecies }) {
  const imageUrl = getSpeciesImageUrl(species)
  const statusInfo = STATUS_LABEL[species.status?.toUpperCase()] ?? null

  return (
    <div className="flex gap-3 border-b border-white/[0.06] py-3.5 last:border-0">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={formatCommonName(species.name)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{formatCommonName(species.name)}</p>
        {species.scientificName ? (
          <p className="mt-0.5 text-[11px] italic text-white/30">{species.scientificName}</p>
        ) : null}
        {statusInfo ? (
          <p className="mt-1 text-[10px]">
            <span className="font-medium text-white/25">Statut UICN · </span>
            <span className={`font-bold uppercase tracking-[0.05em] ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectBiodexSheet({
  species,
  projectType,
  isDonationProject = false,
}: ProjectBiodexSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const cycle = getProjectCycle(projectType)

  const keySpecies = species?.find((sp) => isKeySpecies(sp.role)) ?? species?.[0] ?? null
  const biodexSpecies = keySpecies
    ? (species ?? []).filter((sp) => sp.id !== keySpecies.id)
    : (species ?? [])

  const visibleBiodex = biodexSpecies.slice(0, 3)
  const hiddenCount = biodexSpecies.length - visibleBiodex.length

  const keyImageUrl = keySpecies ? getSpeciesImageUrl(keySpecies) : null
  const keyRole = keySpecies ? cleanRole(keySpecies.role) : ''

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-5">
        <p className="text-[18px] font-black leading-none tracking-[-0.03em] text-white">
          Comprendre ce projet
        </p>
        <p className="mt-1 text-[12px] leading-snug text-white/50">{cycle.subtitle}</p>
      </div>

      {/* ── Élément clé ── */}
      {keySpecies ? (
        <div className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-white/[0.04] p-3">
          <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
            {keyImageUrl ? (
              <img
                src={keyImageUrl}
                alt={formatCommonName(keySpecies.name)}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black leading-tight text-white">
              {formatCommonName(keySpecies.name)}
            </p>
            {keyRole ? (
              <p className="mt-0.5 text-[13px] text-lime-400/80">{keyRole}</p>
            ) : null}
            <span className="mt-2 inline-flex rounded-full bg-lime-300/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime-300">
              Au cœur du projet
            </span>
          </div>
        </div>
      ) : null}

      {/* ── Cycle du projet ── */}
      <div className="mt-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
          Le cycle du projet
        </p>
        <div>
          {cycle.steps.map((step, index) => (
            <div key={step.label} className="flex gap-3 py-2">
              <div className="flex flex-col items-center">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[10px] font-black text-lime-400/80">
                  {index + 1}
                </div>
                {index < cycle.steps.length - 1 ? (
                  <div className="mt-1 w-px flex-1 bg-white/[0.06]" style={{ minHeight: '14px' }} />
                ) : null}
              </div>
              <div className="min-w-0 pb-1.5">
                <p className="text-[13px] font-bold text-white">{step.label}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-white/45">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BioDex (espèces contextuelles) ── */}
      {biodexSpecies.length > 0 ? (
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
            À découvrir dans le BioDex
          </p>
          <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-5 sm:px-5">
            <div className="flex gap-3 pr-4">
              {visibleBiodex.map((sp) => {
                const imgUrl = getSpeciesImageUrl(sp)
                return (
                  <div key={sp.id} className="flex w-[68px] shrink-0 flex-col">
                    <div className="h-[68px] w-[68px] overflow-hidden rounded-xl bg-white/[0.04]">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={formatCommonName(sp.name)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-center text-[10px] font-semibold leading-snug text-white/40">
                      {formatCommonName(sp.name)}
                    </p>
                  </div>
                )
              })}

              {hiddenCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="flex w-[68px] shrink-0 flex-col items-center"
                  aria-label={`Voir les ${hiddenCount} autres espèces du BioDex`}
                >
                  <div className="flex h-[68px] w-[68px] flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] transition-colors hover:bg-white/[0.06] active:bg-white/[0.08]">
                    <span className="text-[13px] font-black leading-none text-white/50">
                      +{hiddenCount}
                    </span>
                    <span className="text-[9px] text-white/30">espèces</span>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Bouton "En savoir plus" → sheet ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 flex w-full items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-white/70">En savoir plus</span>
          <span className="text-xs text-white/35">
            {biodexSpecies.length > 0
              ? 'Cycle complet et espèces BioDex associées'
              : 'Détail du cycle et mécanisme du projet'}
          </span>
        </div>
        <ChevronUp className="h-4 w-4 shrink-0 text-white/25" />
      </button>

      {/* ── Sheet de détail ── */}
      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Comprendre ce projet">
        <p className="mt-1 text-[13px] leading-relaxed text-white/50">{cycle.narrative}</p>

        {/* Élément clé dans la sheet */}
        {keySpecies ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-white/[0.04] p-3">
            <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
              {keyImageUrl ? (
                <img
                  src={keyImageUrl}
                  alt={formatCommonName(keySpecies.name)}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-black leading-tight text-white">
                {formatCommonName(keySpecies.name)}
              </p>
              {keyRole ? (
                <p className="mt-0.5 text-[12px] text-lime-400/70">{keyRole}</p>
              ) : null}
              <span className="mt-1.5 inline-flex rounded-full bg-lime-300/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-lime-300/80">
                Au cœur du projet
              </span>
            </div>
          </div>
        ) : null}

        {/* Cycle dans la sheet */}
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
            Le cycle du projet
          </p>
          <div>
            {cycle.steps.map((step, index) => (
              <div key={step.label} className="flex gap-3 py-2.5">
                <div className="flex flex-col items-center">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[10px] font-black text-lime-400/80">
                    {index + 1}
                  </div>
                  {index < cycle.steps.length - 1 ? (
                    <div
                      className="mt-1 w-px flex-1 bg-white/[0.06]"
                      style={{ minHeight: '16px' }}
                    />
                  ) : null}
                </div>
                <div className="min-w-0 pb-2">
                  <p className="text-[13px] font-bold text-white">{step.label}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-white/50">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BioDex dans la sheet */}
        {species && species.length > 0 ? (
          <div className="mt-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              BioDex · Espèces associées
            </p>
            <p className="mb-3 text-[11px] leading-relaxed text-white/25">
              Ces espèces enrichissent votre parcours de découverte. Elles ne sont pas toutes
              directement liées au mécanisme du projet.
            </p>
            <div>
              {[keySpecies, ...biodexSpecies].filter(Boolean).map((sp) => (
                <SheetSpeciesRow key={sp!.id} species={sp!} />
              ))}
            </div>
          </div>
        ) : null}

        <p className="mt-5 pb-1 text-[11px] leading-relaxed text-white/25">
          Le cycle présenté est une représentation pédagogique du mécanisme du projet. Les données
          terrain peuvent varier selon les conditions locales.
        </p>
        <p className="mt-2 pb-2 text-[10px] leading-relaxed text-white/20">
          {isDonationProject
            ? 'En faisant un don, certaines espèces peuvent être ajoutées à votre collection BioDex.'
            : 'En soutenant ce projet, certaines espèces peuvent être ajoutées à votre collection BioDex.'}
        </p>
      </MobileSheet>
    </>
  )
}
