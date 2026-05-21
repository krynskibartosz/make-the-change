'use client'

import { useState } from 'react'
import { MobileSheet } from '../shared/mobile-sheet'
import { getSupportChips, getReceiveChips } from '../../_utils/project-labels'

type ProjectTrackingPreviewProps = {
  isDonationProject: boolean
  projectType?: string | null
  producerName?: string
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

  const actionChips = getSupportChips(projectType, isDonationProject)
  const receiveChips = getReceiveChips(isDonationProject)

  const sheetTitle = isDonationProject ? 'Du don au terrain' : 'Du soutien au terrain'

  const step1Title = isDonationProject ? 'Vous faites un don' : 'Vous soutenez ce projet'
  const step1Body = isDonationProject
    ? "Votre don est rattaché à ce projet et à l'équipe qui le porte."
    : 'Votre contribution est rattachée à ce projet et au partenaire qui le porte.'
  const step1Disclaimer = isDonationProject
    ? "Ce don n'est pas un achat produit ni une promesse de rendement. Il ne donne pas droit à des Crédits Impact."
    : "Ce soutien n'est pas un achat produit, un investissement financier ou une promesse de rendement."

  const step2Title = isDonationProject
    ? "L'équipe agit sur le terrain"
    : 'Le partenaire agit sur le terrain'
  const step2Intro = isDonationProject
    ? 'Le don peut aider à financer ou accompagner certaines actions concrètes :'
    : 'Le soutien peut aider à financer ou accompagner certaines actions concrètes :'

  const step3Title = isDonationProject ? "Vous suivez l'évolution" : 'Vous recevez des nouvelles'

  const previewSteps = [
    { number: 1, title: step1Title, active: true },
    { number: 2, title: step2Title, active: true },
    { number: 3, title: step3Title, active: false },
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
              <StepDot number={step.number} active={step.active} />
              {i < previewSteps.length - 1 && (
                <div className="mt-1 h-full w-px bg-white/8" />
              )}
            </div>
            <div className="pb-4 pt-0.5">
              <p className={`text-sm font-bold ${step.active ? 'text-white' : 'text-white/35'}`}>
                {step.title}
              </p>
            </div>
          </div>
        ))}
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
            <div className="pb-8 pt-0.5">
              <p className="text-base font-bold text-white">{step1Title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{step1Body}</p>
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
            <div className="pb-8 pt-0.5">
              <p className="text-base font-bold text-white">{step2Title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/50">{step2Intro}</p>
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
              <p className="mt-1 text-sm leading-relaxed text-white/50">
                Selon les informations transmises par le partenaire, vous pouvez suivre :
              </p>
              <ChipCloud chips={receiveChips} />
            </div>
          </div>
        </div>

        {/* Note de prudence */}
        <div className="mt-10 rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            Note de prudence
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/40">
            Le suivi dépend des informations disponibles et transmises par le partenaire. Il
            documente l&apos;avancement du projet, sans garantir un résultat précis.
          </p>
        </div>

        <p className="mt-3 pb-2 text-[10px] leading-relaxed text-white/20">
          {step1Disclaimer}
        </p>
      </MobileSheet>
    </section>
  )
}
