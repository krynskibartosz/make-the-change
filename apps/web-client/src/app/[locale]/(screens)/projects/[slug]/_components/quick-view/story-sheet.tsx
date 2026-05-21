'use client'

import { useState } from 'react'
import { ChevronRight, Info } from 'lucide-react'
import { MobileSheet } from '../shared/mobile-sheet'
import { getTagline, getSupportChips, getReceiveChips } from '../../_utils/project-labels'

type ProjectStorySheetProps = {
  description: string
  title: string
  producerName?: string
  producerLocation?: string
  projectType?: string | null
  isDonationProject?: boolean
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
  producerLocation,
  projectType,
  isDonationProject = false,
}: ProjectStorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!description) return null

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
        <div className="mt-6">
          <SectionLabel>Pourquoi ce projet existe</SectionLabel>
          <p className="text-sm leading-relaxed text-white/70">{description}</p>
          {producerName ? (
            <p className="mt-2 text-[12px] text-white/35">
              {[`Porté par ${producerName}`, producerLocation].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>

        {/* 2. Ce que le soutien peut aider à */}
        <div className="mt-6">
          <SectionLabel>{supportLabel}</SectionLabel>
          <ChipCloud chips={supportChips} />
        </div>

        {/* 3. Ce que vous pourrez suivre */}
        <div className="mt-5">
          <SectionLabel>Ce que vous pourrez suivre</SectionLabel>
          <ChipCloud chips={receiveChips} />
        </div>

        {/* Note de transparence */}
        <div className="mt-6 flex gap-2.5 rounded-xl bg-white/[0.03] px-3.5 py-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
          <p className="text-xs leading-relaxed text-white/40">
            Le suivi dépend des informations transmises par le partenaire. Il documente l&apos;avancement du projet sans garantir un résultat précis.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
