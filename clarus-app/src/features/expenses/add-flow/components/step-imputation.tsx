import type React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'
import { validateStepImputation } from '../validation'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

export function StepImputation({ state, dispatch }: Props) {
  const { imputation } = state
  const validation = validateStepImputation(imputation)

  const handleNext = () => {
    if (validation.isValid) {
      dispatch({ type: 'NEXT_STEP' })
    } else {
      alert(validation.errors.join('\n'))
    }
  }

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">3. Imputation</h2>

      <div className="flex flex-col gap-2">
        <Input
          label="Zone / Phase ID (Optionnel)"
          value={imputation.zonePhaseId || ''}
          onChange={(e) =>
            dispatch({ type: 'SET_IMPUTATION', payload: { zonePhaseId: e.target.value } })
          }
          placeholder="Ex: ZP-123"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Intervention ID (Optionnel)"
          value={imputation.interventionId || ''}
          onChange={(e) =>
            dispatch({ type: 'SET_IMPUTATION', payload: { interventionId: e.target.value } })
          }
          placeholder="Ex: INT-456"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        * Vous devez au moins imputer la dépense à une zone/phase ou à une intervention.
      </p>

      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={handlePrev}>
          Précédent
        </Button>
        <Button onClick={handleNext}>Suivant</Button>
      </div>
    </div>
  )
}
