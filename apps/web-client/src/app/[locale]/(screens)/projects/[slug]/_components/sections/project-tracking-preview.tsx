'use client'

import { useState } from 'react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectTrackingPreviewProps = {
  isDonationProject: boolean
}

type TrackingStep = {
  number: number
  title: string
  body: string
  detail?: string
}

function getSteps(isDonationProject: boolean): TrackingStep[] {
  if (isDonationProject) {
    return [
      {
        number: 1,
        title: 'Vous faites un don',
        body: 'Votre contribution est rattachée à ce projet de restauration, sans contrepartie économique directe.',
        detail:
          "Pas de Crédits Impact, pas de produit, pas de rendement. Il s'agit d'un don pur.",
      },
      {
        number: 2,
        title: "L'équipe agit sur le terrain",
        body: "Le don soutient l'implantation, le suivi ou l'entretien de l'action terrain.",
      },
      {
        number: 3,
        title: "Vous suivez l'évolution",
        body: 'Photos, localisation et mises à jour peuvent documenter la progression.',
      },
    ]
  }

  return [
    {
      number: 1,
      title: 'Vous soutenez ce projet',
      body: 'Votre contribution est rattachée à ce projet, ce partenaire et cette filière.',
      detail:
        "Ce n'est pas un achat produit, ni un investissement financier, ni une promesse de rendement.",
    },
    {
      number: 2,
      title: 'Le partenaire agit sur le terrain',
      body: "Le soutien aide l'équipement, le suivi local ou la valorisation de la production.",
    },
    {
      number: 3,
      title: 'Vous recevez des nouvelles',
      body: 'Photos, mises à jour ou précisions peuvent enrichir le suivi du projet.',
    },
  ]
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

export function ProjectTrackingPreview({ isDonationProject }: ProjectTrackingPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const steps = getSteps(isDonationProject)
  const preview = steps.slice(0, 2)

  return (
    <section>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        {isDonationProject ? 'Du don au terrain' : 'Du soutien au terrain'}
      </p>

      <div className="space-y-0">
        {preview.map((step, i) => (
          <div key={step.number} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepDot number={step.number} active />
              {i < preview.length - 1 && (
                <div className="mt-1 h-full w-px bg-white/8" />
              )}
            </div>
            <div className="pb-4 pt-0.5">
              <p className="text-sm font-bold text-white">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/50">{step.body}</p>
            </div>
          </div>
        ))}

        {/* Ellipsis hint for step 3 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <StepDot number={3} />
          </div>
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

      <MobileSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isDonationProject ? 'Du don au terrain' : 'Du soutien au terrain'}
      >
        <div className="mt-2 space-y-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-xs font-black text-white">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-1.5 h-full w-px bg-white/8" />
                )}
              </div>
              <div className="pb-6 pt-0.5">
                <p className="text-base font-bold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{step.body}</p>
                {step.detail ? (
                  <p className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-white/40">
                    {step.detail}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </MobileSheet>
    </section>
  )
}
