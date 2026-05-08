'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectStorySheetProps = {
  description: string
  title: string
  producerName?: string
  producerDescription?: string
  producerLabel?: string
  projectType?: string | null
  isDonationProject?: boolean
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

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/60">
      {children}
    </span>
  )
}

function ChipCloud({ chips }: { chips: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
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
  projectType,
  isDonationProject = false,
}: ProjectStorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!description && !producerName) return null

  const supportChips = getSupportChips(projectType, isDonationProject)
  const receiveChips = getReceiveChips(isDonationProject)
  const supportLabel = isDonationProject ? 'Ce don peut aider' : 'Ce soutien peut aider'

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white/50 transition-colors hover:text-white/80"
      >
        Lire l&apos;histoire du projet
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {/* 1. Pourquoi ce projet existe */}
        {description ? (
          <div className="mt-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              Pourquoi ce projet existe
            </p>
            <p className="text-sm leading-relaxed text-white/70">{description}</p>
          </div>
        ) : null}

        {/* 2. Le partenaire */}
        {producerName ? (
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              {producerLabel ?? 'Le partenaire'}
            </p>
            <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-black text-white/60">
                {producerName[0]?.toUpperCase() ?? 'P'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{producerName}</p>
                {producerDescription ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-white/50">{producerDescription}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. Ce que le soutien peut aider */}
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            {supportLabel}
          </p>
          <ChipCloud chips={supportChips} />
        </div>

        {/* 4. Ce que vous pourrez suivre */}
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            Ce que vous pourrez suivre
          </p>
          <ChipCloud chips={receiveChips} />
        </div>

        {/* Note */}
        <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
          Ces éléments dépendent du projet et du partenaire. Ils ne constituent pas une promesse contractuelle.
        </p>
      </MobileSheet>
    </>
  )
}
