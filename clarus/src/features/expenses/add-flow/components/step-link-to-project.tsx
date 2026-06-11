'use client'

import type React from 'react'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, StickyActionBar } from '@/components/ui'
import { mockZones, mockInterventions } from '@/lib/mock'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'
import { validateStepLinkToProject } from '../validation'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

const LINK_OPTIONS: { value: 'project' | 'zone' | 'intervention'; label: string; description: string }[] = [
  { value: 'project', label: 'Tout le chantier', description: 'Frais généraux non attribuables' },
  { value: 'zone', label: 'Une zone spécifique', description: 'Matériaux ou outils pour une zone' },
  { value: 'intervention', label: 'Un travail spécifique', description: 'Lié à une journée de travail' },
]

export function StepLinkToProject({ state, dispatch }: Props) {
  const [error, setError] = useState<string | null>(null)
  const { linkToProject } = state

  const handleNext = () => {
    const res = validateStepLinkToProject(linkToProject)
    if (!res.isValid) {
      setError(res.errors[0] ?? null)
      return
    }
    setError(null)
    dispatch({ type: 'NEXT_STEP' })
  }

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  return (
    <div className="flex flex-col gap-6 pb-28">

      {/* Lien au projet */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Cet achat concerne :</p>
        <div className="grid gap-2">
          {LINK_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                dispatch({ type: 'SET_LINK_TO_PROJECT', payload: { linkType: option.value } })
              }
              className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-colors ${
                linkToProject.linkType === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
              }`}
            >
              <span className="text-sm font-bold">{option.label}</span>
              <span className="text-xs font-normal text-muted-foreground">{option.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Zone selector */}
      {linkToProject.linkType === 'zone' && (
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quelle zone ?</p>
          <div className="grid gap-1.5 max-h-48 overflow-y-auto">
            {mockZones
              .filter((z) => z.type === 'simple')
              .map((zone) => (
                <button
                  key={zone.id}
                  onClick={() =>
                    dispatch({ type: 'SET_LINK_TO_PROJECT', payload: { zoneId: zone.id } })
                  }
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    linkToProject.zoneId === zone.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  {zone.name}
                  {zone.description && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">{zone.description}</span>
                  )}
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Intervention selector */}
      {linkToProject.linkType === 'intervention' && (
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quel travail ?</p>
          <div className="grid gap-1.5 max-h-48 overflow-y-auto">
            {mockInterventions.slice(0, 5).map((intervention) => (
              <button
                key={intervention.id}
                onClick={() =>
                  dispatch({ type: 'SET_LINK_TO_PROJECT', payload: { interventionId: intervention.id } })
                }
                className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                  linkToProject.interventionId === intervention.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                }`}
              >
                {intervention.title}
                <span className="ml-2 text-xs font-normal text-muted-foreground">{intervention.date}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Options */}
      <section className="grid gap-3 rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Options</p>
        <button
          onClick={() =>
            dispatch({ type: 'SET_LINK_TO_PROJECT', payload: { isRebillable: !linkToProject.isRebillable } })
          }
          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
            linkToProject.isRebillable
              ? 'border-warning/50 bg-warning/10'
              : 'border-border bg-background hover:bg-surface'
          }`}
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
              linkToProject.isRebillable ? 'border-warning bg-warning' : 'border-border bg-background'
            }`}
          >
            {linkToProject.isRebillable && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Supplément à refacturer</p>
            <p className="text-xs text-muted-foreground">Cette dépense sera facturée au client en plus du devis</p>
          </div>
        </button>

        <button
          onClick={() =>
            dispatch({ type: 'SET_LINK_TO_PROJECT', payload: { isToCheck: !linkToProject.isToCheck } })
          }
          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
            linkToProject.isToCheck
              ? 'border-primary/50 bg-primary/5'
              : 'border-border bg-background hover:bg-surface'
          }`}
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
              linkToProject.isToCheck ? 'border-primary bg-primary' : 'border-border bg-background'
            }`}
          >
            {linkToProject.isToCheck && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">À vérifier plus tard</p>
            <p className="text-xs text-muted-foreground">Doute sur le montant ou l'imputation</p>
          </div>
        </button>
      </section>

      {error && (
        <p className="rounded-[var(--radius-card)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <StickyActionBar
        primaryAction={
          <Button fullWidth onClick={handleNext} rightIcon={<ChevronRight className="size-4" />}>
            Continuer
          </Button>
        }
        secondaryAction={
          <Button variant="secondary" onClick={handlePrev} leftIcon={<ChevronLeft className="size-4" />}>
            Retour
          </Button>
        }
      />
    </div>
  )
}
