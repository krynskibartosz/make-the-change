'use client'

import { useState } from 'react'
import { ChevronRight, Info } from 'lucide-react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectStorySheetProps = {
  description: string
  title: string
  producerName?: string
  producerDescription?: string
  producerLabel?: string
  producerLocation?: string
  projectType?: string | null
  isDonationProject?: boolean
}

function getTagline(projectType: string | null | undefined, isDonationProject: boolean): string {
  const type = projectType?.toLowerCase() ?? ''
  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return 'Soutenir la restauration des récifs coralliens et documenter leur évolution terrain.'
  }
  if (type.includes('orchard') || type.includes('olive')) {
    return 'Soutenir des producteurs locaux et la valorisation de leurs terres vivantes.'
  }
  return 'Soutenir des ruches locales, leur suivi terrain et la valorisation du miel produit.'
}

function getSupportChips(projectType: string | null | undefined, isDonationProject: boolean): string[] {
  const type = projectType?.toLowerCase() ?? ''
  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return ['Implantation coraux', 'Équipement plongée', 'Suivi photo', 'Entretien nurseries']
  }
  if (type.includes('orchard') || type.includes('olive')) {
    return ['Taille oliviers', 'Équipement récolte', 'Transformation huile', 'Distribution locale']
  }
  return ['Entretien des ruches', 'Matériel apicole', 'Déplacements terrain', 'Suivi sanitaire', 'Récolte du miel']
}

function getReceiveChips(isDonationProject: boolean): string[] {
  if (isDonationProject) {
    return ['Photos sous-marines', 'Nouvelles projet', 'Progression documentée', 'Infos partenaire']
  }
  return ['Photos terrain', 'Nouvelles partenaire', 'Étapes projet', 'Suivi production']
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
      {children}
    </p>
  )
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/50">
      {children}
    </span>
  )
}

function ChipCloud({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <Chip key={chip}>{chip}</Chip>
      ))}
    </div>
  )
}

export function ProjectStorySheet({
  description,
  title,
  producerName,
  producerDescription,
  producerLabel,
  producerLocation,
  projectType,
  isDonationProject = false,
}: ProjectStorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!description && !producerName) return null

  const tagline = getTagline(projectType, isDonationProject)
  const supportChips = getSupportChips(projectType, isDonationProject)
  const receiveChips = getReceiveChips(isDonationProject)
  const supportLabel = isDonationProject ? 'Ce don peut aider à' : 'Votre soutien peut aider à'

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center justify-between rounded-xl py-2.5 text-left transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
      >
        <span className="text-sm font-semibold text-white/55">Lire l&apos;histoire du projet</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/25" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {/* Tagline émotionnel */}
        <p className="mt-1 text-sm leading-relaxed text-white/45">{tagline}</p>

        {/* 1. Pourquoi ce projet existe */}
        {description ? (
          <div className="mt-6">
            <SectionLabel>Pourquoi ce projet existe</SectionLabel>
            <p className="text-sm leading-relaxed text-white/70">{description}</p>
          </div>
        ) : null}

        {/* 2. Partenaire terrain */}
        {producerName ? (
          <div className="mt-6">
            <SectionLabel>{producerLabel ?? 'Partenaire terrain'}</SectionLabel>
            <div className="flex items-center gap-3.5 rounded-2xl bg-white/[0.04] px-4 py-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                {producerName[0]?.toUpperCase() || 'M'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{producerName}</p>
                {producerDescription ? (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/50">
                    {producerDescription}
                  </p>
                ) : null}
                {producerLocation ? (
                  <p className="mt-1 text-[10px] font-semibold text-white/30">{producerLocation}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. Ce que le soutien peut aider à */}
        <div className="mt-6">
          <SectionLabel>{supportLabel}</SectionLabel>
          <ChipCloud chips={supportChips} />
        </div>

        {/* 4. Ce que vous pourrez suivre */}
        <div className="mt-5">
          <SectionLabel>Ce que vous pourrez suivre</SectionLabel>
          <ChipCloud chips={receiveChips} />
        </div>

        {/* Note de transparence */}
        <div className="mt-6 flex gap-2.5 rounded-xl bg-white/[0.03] px-3.5 py-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
          <p className="text-xs leading-relaxed text-white/40">
            Les éléments de suivi dépendent du projet et du partenaire. Ils permettent de documenter le soutien, sans constituer une promesse de résultat garanti.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
