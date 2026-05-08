'use client'

import { useState } from 'react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectTrackingPreviewProps = {
  isDonationProject: boolean
  projectType?: string | null
  producerName?: string
}

function getActionChips(
  projectType: string | null | undefined,
  isDonationProject: boolean,
): string[] {
  const type = projectType?.toLowerCase() ?? ''

  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return ['Implantation des coraux', 'Équipement plongée', 'Suivi photo', 'Entretien nurseries']
  }

  if (type.includes('orchard') || type.includes('olive')) {
    return ['Taille des oliviers', 'Équipement récolte', 'Transformation huile', 'Valorisation locale']
  }

  return ['Entretien des ruches', 'Matériel apicole', 'Déplacements terrain', 'Récolte du miel']
}

function getReceiveChips(isDonationProject: boolean): string[] {
  if (isDonationProject) {
    return ['Photos sous-marines', 'Nouvelles projet', 'Progression documentée', 'Infos partenaire']
  }
  return ['Photos terrain', 'Nouvelles partenaire', 'Étapes projet', 'Suivi production']
}

function StepDot({ number, active }: { number: number; active?: boolean }) {
  return (
    <div
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${
        active
          ? 'border-white/20 bg-white/10 text-white'
          : 'border-white/8 bg-white/[0.03] text-white/30'
      }`}
    >
      {number}
    </div>
  )
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

export function ProjectTrackingPreview({
  isDonationProject,
  projectType,
  producerName,
}: ProjectTrackingPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actionChips = getActionChips(projectType, isDonationProject)
  const receiveChips = getReceiveChips(isDonationProject)

  const sheetTitle = isDonationProject ? 'Du don au terrain' : 'Du soutien au terrain'

  const step1Title = isDonationProject ? 'Vous faites un don' : 'Vous soutenez ce projet'
  const step1Body = producerName
    ? isDonationProject
      ? `Votre don est lié à ${producerName} et à ce projet de restauration.`
      : `Votre contribution est liée à ${producerName} et à cette filière.`
    : isDonationProject
      ? 'Votre contribution est rattachée à ce projet de restauration, sans contrepartie économique.'
      : 'Votre contribution est rattachée à ce projet, ce partenaire et cette filière.'
  const step1Detail = isDonationProject
    ? "Pas de Crédits Impact, pas de produit, pas de rendement. Il s'agit d'un don pur."
    : "Ce n'est pas un achat produit, ni un investissement financier, ni une promesse de rendement."

  const step2Title = isDonationProject
    ? "L'équipe agit sur le terrain"
    : 'Le partenaire agit sur le terrain'
  const step2Intro = isDonationProject ? 'Le don peut aider :' : 'Le soutien peut aider :'

  const step3Title = isDonationProject ? "Vous suivez l'évolution" : 'Vous recevez des nouvelles'

  const previewSteps = [
    { number: 1, title: step1Title },
    { number: 2, title: step2Title },
  ]

  return (
    <section>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        {sheetTitle}
      </p>

      {/* Mini timeline preview */}
      <div className="space-y-0">
        {previewSteps.map((step, i) => (
          <div key={step.number} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepDot number={step.number} active />
              {i < previewSteps.length - 1 && (
                <div className="mt-1 h-full w-px bg-white/8" />
              )}
            </div>
            <div className="pb-4 pt-0.5">
              <p className="text-sm font-bold text-white">{step.title}</p>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <StepDot number={3} />
          <div className="pt-0.5">
            <p className="text-sm font-semibold text-white/30">…</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center justify-between rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className="text-sm font-bold text-white/70">Comprendre le suivi</span>
        <span className="text-xs text-white/30">3 étapes →</span>
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={sheetTitle}>
        <div className="mt-2 space-y-0">
          {/* Étape 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-xs font-black text-white">
                1
              </div>
              <div className="mt-1.5 h-full w-px bg-white/8" />
            </div>
            <div className="pb-6 pt-0.5">
              <p className="text-base font-bold text-white">{step1Title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{step1Body}</p>
              <p className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-white/40">
                {step1Detail}
              </p>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-xs font-black text-white">
                2
              </div>
              <div className="mt-1.5 h-full w-px bg-white/8" />
            </div>
            <div className="pb-6 pt-0.5">
              <p className="text-base font-bold text-white">{step2Title}</p>
              <p className="mt-1 text-sm text-white/50">{step2Intro}</p>
              <ChipCloud chips={actionChips} />
            </div>
          </div>

          {/* Étape 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-xs font-black text-white">
                3
              </div>
            </div>
            <div className="pb-4 pt-0.5">
              <p className="text-base font-bold text-white">{step3Title}</p>
              <ChipCloud chips={receiveChips} />
            </div>
          </div>
        </div>

        {/* Note de prudence */}
        <div className="mt-5 rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            Note de prudence
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/40">
            Le suivi dépend des informations transmises par le partenaire. Ces éléments ne
            constituent pas une promesse contractuelle.
          </p>
        </div>

        <p className="mt-3 pb-2 text-[10px] leading-relaxed text-white/20">
          {isDonationProject
            ? 'Pas de reçu fiscal. Pas de rendement. Pas de Crédits Impact.'
            : 'Pas de rendement financier. Pas de reçu fiscal.'}
        </p>
      </MobileSheet>
    </section>
  )
}
