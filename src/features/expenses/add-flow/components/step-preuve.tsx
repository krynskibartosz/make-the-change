import type React from 'react'
import { Button } from '@/components/ui/button'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

export function StepPreuve({ state, dispatch }: Props) {
  const { preuve } = state

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const handleMockUpload = () => {
    dispatch({
      type: 'SET_PREUVE',
      payload: { photoUrl: 'https://mock-image-url.com/receipt.jpg' },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">2. Preuve (Reçu / Facture)</h2>

      <div className="flex flex-col gap-2 items-start">
        {preuve.photoUrl ? (
          <div className="p-4 border rounded bg-green-50 text-green-700">
            Image uploadée avec succès ! ({preuve.photoUrl})
          </div>
        ) : (
          <Button variant="secondary" onClick={handleMockUpload}>
            Simuler Upload Photo
          </Button>
        )}
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
