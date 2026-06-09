'use client'

import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Dispatch, useReducer } from 'react'

import { Button, StickyActionBar } from '@/components/ui'
import { mockPeople, mockPhases, mockProject, mockZones } from '@/lib/mock'
import { mockClarusRepository } from '@/lib/repositories'

import { createDraftInputFromState } from './draft'
import { ADD_INTERVENTION_STEPS } from './options'
import {
  type AddInterventionAction,
  createInitialAddInterventionState,
  reduceAddInterventionState,
} from './reducer'
import { StepStatus } from './step-status'
import { StepSummary } from './step-summary'
import { StepWhat } from './step-what'
import { StepWhen } from './step-when'
import { StepWhere } from './step-where'
import { StepWho } from './step-who'
import type { AddInterventionState } from './types'
import { validateAddInterventionState } from './validation'

type AddInterventionFlowProps = Readonly<{
  today: string
}>

export function AddInterventionFlow({ today }: AddInterventionFlowProps) {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    reduceAddInterventionState,
    { today },
    createInitialAddInterventionState,
  )
  const stepIndex = ADD_INTERVENTION_STEPS.findIndex((step) => step.id === state.currentStep)
  const validation = validateAddInterventionState(state)

  async function saveDraft() {
    dispatch({ type: 'setSaveState', saveState: 'saving' })

    try {
      const draft = await mockClarusRepository.createInterventionDraft(
        createDraftInputFromState({
          project: mockProject,
          people: mockPeople,
          state,
        }),
      )

      dispatch({ type: 'setSaveState', saveState: 'saved' })
      router.push(`/interventions/${draft.intervention.id}`)
    } catch (error) {
      dispatch({
        type: 'setSaveState',
        saveState: 'error',
        saveError: error instanceof Error ? error.message : 'Sauvegarde impossible.',
      })
    }
  }

  const goPrevious = () => {
    const previous = ADD_INTERVENTION_STEPS[Math.max(stepIndex - 1, 0)]

    if (previous) {
      dispatch({ type: 'goToStep', step: previous.id })
    }
  }

  const goNext = () => {
    const next = ADD_INTERVENTION_STEPS[Math.min(stepIndex + 1, ADD_INTERVENTION_STEPS.length - 1)]

    if (next) {
      dispatch({ type: 'goToStep', step: next.id })
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5 pb-28">
      <StepProgress currentIndex={stepIndex} />
      {renderStep({ dispatch, state, validation })}
      {state.saveState === 'saved' ? (
        <p className="rounded-[var(--radius-card)] border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          Intervention ajoutee.
        </p>
      ) : null}
      {state.saveError ? (
        <p className="rounded-[var(--radius-card)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {state.saveError}
        </p>
      ) : null}
      <StickyActionBar
        primaryAction={
          state.currentStep === 'summary' ? (
            <Button
              disabled={!validation.canSave || state.saveState === 'saving'}
              fullWidth
              leftIcon={<Check aria-hidden="true" className="size-4" />}
              onClick={saveDraft}
            >
              {state.saveState === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={goNext}
              rightIcon={<ChevronRight aria-hidden="true" className="size-4" />}
            >
              Continuer
            </Button>
          )
        }
        secondaryAction={
          stepIndex > 0 ? (
            <Button
              leftIcon={<ChevronLeft aria-hidden="true" className="size-4" />}
              onClick={goPrevious}
              variant="secondary"
            >
              Retour
            </Button>
          ) : null
        }
      />
    </div>
  )
}

function renderStep({
  dispatch,
  state,
  validation,
}: {
  dispatch: Dispatch<AddInterventionAction>
  state: AddInterventionState
  validation: ReturnType<typeof validateAddInterventionState>
}) {
  switch (state.currentStep) {
    case 'what':
      return <StepWhat dispatch={dispatch} state={state.what} />
    case 'where':
      return (
        <StepWhere dispatch={dispatch} phases={mockPhases} state={state.where} zones={mockZones} />
      )
    case 'who':
      return <StepWho dispatch={dispatch} people={mockPeople} state={state.who} />
    case 'when':
      return (
        <StepWhen
          dispatch={dispatch}
          people={mockPeople}
          selectedPersonIds={state.who.personIds}
          state={state.when}
        />
      )
    case 'status':
      return <StepStatus dispatch={dispatch} state={state.status} />
    case 'summary':
      return (
        <StepSummary
          people={mockPeople}
          phases={mockPhases}
          state={state}
          validation={validation}
          zones={mockZones}
        />
      )
  }
}

function StepProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <section aria-label="Progression ajout intervention" className="grid gap-2">
      <div className="flex gap-1">
        {ADD_INTERVENTION_STEPS.map((step, index) => (
          <span
            className={
              index <= currentIndex
                ? 'h-1 flex-1 rounded-full bg-primary'
                : 'h-1 flex-1 rounded-full bg-border'
            }
            key={step.id}
          />
        ))}
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        {ADD_INTERVENTION_STEPS[currentIndex]?.label ?? 'Ajouter'}
      </p>
    </section>
  )
}
