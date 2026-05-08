'use client'

import { useState } from 'react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectTrackingPreviewProps = {
  isDonationProject: boolean
  projectType?: string | null
}

type TrackingStep = {
  number: number
  title: string
  body?: string
  detail?: string
  bullets?: string[]
}

function getStep2Bullets(projectType: string | null | undefined, isDonationProject: boolean): string[] {
  const type = projectType?.toLowerCase() ?? ''

  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    return [
      "l'implantation des fragments de corail",
      "les équipements de plongée et de suivi",
      "le suivi photographique du site",
      "l'entretien des structures de nurserie",
    ]
  }

  if (type.includes('orchard') || type.includes('olive')) {
    return [
      "la taille et l'entretien des oliviers",
      "les équipements de récolte",
      "la transformation de l'huile",
      "la valorisation des produits",
    ]
  }

  return [
    "l'entretien et le suivi des ruches",
    "les déplacements terrain du producteur",
    "le matériel apicole",
    "la récolte du miel",
  ]
}

function getSteps(isDonationProject: boolean, projectType: string | null | undefined): TrackingStep[] {
  const step2Bullets = getStep2Bullets(projectType, isDonationProject)

  if (isDonationProject) {
    return [
      {
        number: 1,
        title: 'Vous faites un don',
        body: 'Votre contribution est rattachée à ce projet de restauration, sans contrepartie économique directe.',
        detail: "Pas de Crédits Impact, pas de produit, pas de rendement. Il s'agit d'un don pur.",
      },
      {
        number: 2,
        title: "L'équipe agit sur le terrain",
        body: 'Le don peut aider :',
        bullets: step2Bullets,
      },
      {
        number: 3,
        title: "Vous suivez l'évolution",
        body: 'Vous pourrez recevoir :',
        bullets: [
          'photos et vidéos du site sous-marin',
          'nouvelles du projet de restauration',
          'étapes de progression documentées',
          'informations du partenaire terrain',
        ],
      },
    ]
  }

  return [
    {
      number: 1,
      title: 'Vous soutenez ce projet',
      body: 'Votre contribution est rattachée à ce projet, ce partenaire et cette filière.',
      detail: "Ce n'est pas un achat produit, ni un investissement financier, ni une promesse de rendement.",
    },
    {
      number: 2,
      title: 'Le partenaire agit sur le terrain',
      body: 'Le soutien peut aider :',
      bullets: step2Bullets,
    },
    {
      number: 3,
      title: 'Vous recevez des nouvelles',
      body: 'Vous pourrez recevoir :',
      bullets: [
        'photos et nouvelles terrain',
        'étapes importantes du projet',
        'informations du partenaire',
        'mises à jour de la production',
      ],
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1.5 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-white/55">
          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ProjectTrackingPreview({ isDonationProject, projectType }: ProjectTrackingPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const steps = getSteps(isDonationProject, projectType)
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
              {step.body ? (
                <p className="mt-0.5 text-xs leading-relaxed text-white/50">{step.body}</p>
              ) : null}
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
                {step.body ? (
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{step.body}</p>
                ) : null}
                {step.bullets ? <BulletList items={step.bullets} /> : null}
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
