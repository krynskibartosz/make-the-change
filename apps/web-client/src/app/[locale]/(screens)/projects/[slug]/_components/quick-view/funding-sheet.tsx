'use client'

import { useState } from 'react'
import { MobileSheet } from '../shared/mobile-sheet'
import { formatAmountNumber } from '@/lib/formatters'
import { getSupportChips } from '../../_utils/project-labels'

type ProjectFundingSheetProps = {
  targetBudget: number
  currentFunding: number
  fundingProgress: number
  projectType?: string | null
  isDonationProject?: boolean
  fundingTitle: string
}

type MilestoneStatus = 'done' | 'active' | 'pending'

type Milestone = {
  label: string
  threshold: number
  status: MilestoneStatus
}

function getMilestones(
  projectType: string | null | undefined,
  isDonationProject: boolean,
  progress: number,
): Milestone[] {
  const type = projectType?.toLowerCase() ?? ''

  let definitions: { label: string; threshold: number }[]

  if (isDonationProject || type.includes('coral') || type.includes('reef')) {
    definitions = [
      { label: 'Équipement de base sécurisé', threshold: 20 },
      { label: 'Premières implantations engagées', threshold: 45 },
      { label: 'Nurseries en développement', threshold: 70 },
      { label: 'Suivi documenté et prolongé', threshold: 90 },
    ]
  } else if (type.includes('orchard') || type.includes('olive')) {
    definitions = [
      { label: 'Équipement de récolte sécurisé', threshold: 20 },
      { label: 'Suivi agronomique engagé', threshold: 45 },
      { label: 'Transformation et valorisation', threshold: 70 },
      { label: 'Distribution locale soutenue', threshold: 90 },
    ]
  } else {
    definitions = [
      { label: 'Matériel apicole sécurisé', threshold: 20 },
      { label: 'Suivi sanitaire engagé', threshold: 45 },
      { label: 'Récolte et valorisation du miel', threshold: 70 },
      { label: 'Extension du rucher', threshold: 90 },
    ]
  }

  return definitions.map(({ label, threshold }) => {
    let status: MilestoneStatus
    if (progress >= threshold) {
      status = 'done'
    } else if (progress >= threshold - 20) {
      status = 'active'
    } else {
      status = 'pending'
    }
    return { label, threshold, status }
  })
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/60">
      {children}
    </span>
  )
}

const STATUS_ICON: Record<MilestoneStatus, { symbol: string; color: string }> = {
  done:    { symbol: '✓', color: 'text-emerald-400' },
  active:  { symbol: '~', color: 'text-amber-300' },
  pending: { symbol: '○', color: 'text-white/25' },
}

export function ProjectFundingSheet({
  targetBudget,
  currentFunding,
  fundingProgress,
  projectType,
  isDonationProject = false,
  fundingTitle,
}: ProjectFundingSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const chips = getSupportChips(projectType, isDonationProject)
  const milestones = getMilestones(projectType, isDonationProject, fundingProgress)
  const progress = Math.min(Math.round(fundingProgress), 100)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/35 transition-colors hover:text-white/60"
      >
        Comprendre cet objectif
        <span className="text-white/25">→</span>
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={fundingTitle}>
        {/* Stats */}
        <p className="mt-1 text-sm text-white/50">
          {formatAmountNumber(currentFunding)} EUR collectés · {progress}% de l&apos;objectif de{' '}
          {formatAmountNumber(targetBudget)} EUR.
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Peut aider */}
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            Le soutien peut aider
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
        </div>

        {/* Objectifs */}
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            Objectifs du projet
          </p>
          <div className="mt-2">
            {milestones.map((m) => {
              const { symbol, color } = STATUS_ICON[m.status]
              return (
                <div
                  key={m.label}
                  className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0"
                >
                  <span className={`w-4 shrink-0 text-center text-[13px] font-black ${color}`}>
                    {symbol}
                  </span>
                  <p
                    className={`flex-1 text-sm ${
                      m.status === 'pending' ? 'text-white/35' : 'text-white/70'
                    }`}
                  >
                    {m.label}
                  </p>
                  {m.status === 'active' ? (
                    <span className="shrink-0 text-[10px] font-bold text-amber-300/70">
                      En cours
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-white/25">
            Ces étapes sont indicatives. Elles ne constituent pas un reporting certifié.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
          Ce montant est un objectif estimatif du projet. Il ne garantit pas un résultat précis ni
          un impact mesuré.
        </p>
      </MobileSheet>
    </>
  )
}
