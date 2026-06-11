'use client'

import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useReducer } from 'react'

import { Button, StickyActionBar } from '@/components/ui'
import { mockPeople, mockPhases, mockProject, mockZones } from '@/lib/mock'
import { mockClarusRepository } from '@/lib/repositories'

import { createDraftInputFromState } from './draft'
import { ADD_INTERVENTION_STEPS } from './options'
import { createInitialAddInterventionState, reduceAddInterventionState } from './reducer'
import { StepQuickForm } from './step-quick-form'
import { StepSummary } from './step-summary'
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
    if (previous) dispatch({ type: 'goToStep', step: previous.id })
  }

  const goNext = () => {
    const next = ADD_INTERVENTION_STEPS[Math.min(stepIndex + 1, ADD_INTERVENTION_STEPS.length - 1)]
    if (next) dispatch({ type: 'goToStep', step: next.id })
  }

  return (
    <div className="flex flex-1 flex-col gap-5 pb-28">
      <StepProgress currentIndex={stepIndex} />

      {state.currentStep === 'quick_form' && (
        <StepQuickForm
          dispatch={dispatch}
          people={mockPeople}
          phases={mockPhases}
          state={state}
          zones={mockZones}
        />
      )}

      {state.currentStep === 'summary' && (
        <StepSummary
          dispatch={dispatch}
          people={mockPeople}
          phases={mockPhases}
          state={state}
          validation={validation}
          zones={mockZones}
        />
      )}

      {state.saveState === 'saved' ? (
        <p className="rounded-[var(--radius-card)] border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          Travail enregistré !
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
              Vérifier et enregistrer
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

function StepProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <section aria-label="Progression" className="grid gap-2">
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
        {ADD_INTERVENTION_STEPS[currentIndex]?.label ?? 'Travail réalisé'}
      </p>
    </section>
  )
}
