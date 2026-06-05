'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { Progress } from '@make-the-change/core/ui'
import { MobileSheet } from '../shared/mobile-sheet'
import { formatAmountNumber } from '@/lib/formatters'
import { getSupportChips } from '../../_utils/project-labels'

type ProjectFundingSheetProps = {
  targetBudget: number
  currentFunding: number
  fundingProgress: number
  projectType?: string | null
  isContributionProject?: boolean
  fundingTitle: string
  indicatorClassName?: string
}

type MilestoneStatus = 'done' | 'active' | 'pending'

type Milestone = {
  label: string
  threshold: number
  status: MilestoneStatus
}

function getMilestones(
  projectType: string | null | undefined,
  isContributionProject: boolean,
  progress: number,
): Milestone[] {
  const type = projectType?.toLowerCase() ?? ''

  let definitions: { label: string; threshold: number }[]

  if (isContributionProject || type.includes('coral') || type.includes('reef')) {
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

const STATUS_LABEL: Record<MilestoneStatus, { label: string; color: string }> = {
  done:    { label: 'Engagé',          color: 'text-emerald-400/80' },
  active:  { label: 'En cours',        color: 'text-amber-300/80' },
  pending: { label: 'Étape suivante',  color: 'text-white/25' },
}

export function ProjectFundingSheet({
  targetBudget,
  currentFunding,
  fundingProgress,
  projectType,
  isContributionProject = false,
  fundingTitle,
  indicatorClassName,
}: ProjectFundingSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const chips = getSupportChips(projectType, isContributionProject)
  const milestones = getMilestones(projectType, isContributionProject, fundingProgress)
  const progress = Math.min(Math.round(fundingProgress), 100)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center justify-between rounded-xl bg-white/[0.025] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className="text-sm font-bold text-white/70">Comprendre cet objectif</span>
        <ChevronUp className="h-4 w-4 shrink-0 text-white/25" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={fundingTitle}>
        {/* Stats */}
        <p className="mt-1 text-sm text-white/50">
          {formatAmountNumber(currentFunding)} EUR collectés · {progress}%{' '}
          de l&apos;objectif de {formatAmountNumber(targetBudget)} EUR.
        </p>

        {/* Progress bar */}
        <Progress
          value={progress}
          max={100}
          className="mt-3 h-1.5 rounded-full bg-white/[0.08]"
          indicatorClassName={indicatorClassName ?? 'bg-gradient-to-r from-amber-500/60 to-lime-400/50'}
        />

        {/* Intro */}
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          Cet objectif aide à financer les besoins du projet et à accompagner son développement sur le terrain.
        </p>

        {/* Peut aider */}
        <div className="mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            Le soutien peut aider à
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
        </div>

        {/* Étapes */}
        <div className="mt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            Ce que l&apos;objectif peut accompagner
          </p>
          <div className="mt-2">
            {milestones.map((m) => {
              const { label: statusLabel, color } = STATUS_LABEL[m.status]
              return (
                <div
                  key={m.label}
                  className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0"
                >
                  <p
                    className={`flex-1 text-sm ${
                      m.status === 'pending' ? 'text-white/35' : 'text-white/70'
                    }`}
                  >
                    {m.label}
                  </p>
                  <span className={`shrink-0 text-[11px] font-semibold ${color}`}>
                    {statusLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
            À garder en tête
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/40">
            Ces étapes sont indicatives et dépendent du terrain, du partenaire et des informations
            disponibles.
          </p>
        </div>

        <p className="mt-3 pb-2 text-xs leading-relaxed text-white/30">
          Ce montant est un objectif estimatif du projet. Il ne garantit pas un résultat précis ni
          un impact mesuré.
        </p>
      </MobileSheet>
    </>
  )
}
