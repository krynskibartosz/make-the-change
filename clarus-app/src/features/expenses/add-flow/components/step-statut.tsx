import type React from 'react'
import { Button } from '@/components/ui/button'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

export function StepStatut({ state, dispatch }: Props) {
  const { statut } = state

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">4. Statut</h2>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRebillable"
          checked={statut.isRebillable}
          onChange={(e) =>
            dispatch({ type: 'SET_STATUT', payload: { isRebillable: e.target.checked } })
          }
          className="w-4 h-4"
        />
        <label htmlFor="isRebillable" className="text-sm font-medium cursor-pointer">
          Dépense refacturable au client
        </label>
      </div>

      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={handlePrev}>
          Précédent
        </Button>
        <Button onClick={handleNext}>Suivant</Button>
      </div>
    </div>
  )
}
