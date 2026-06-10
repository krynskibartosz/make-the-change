import type React from 'react'
import { Button } from '@/components/ui/button'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
  onSave: (state: ExpenseAddFlowState) => void
}

export function StepResume({ state, dispatch, onSave }: Props) {
  const { quoi, preuve, imputation, statut } = state

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const handleSave = () => {
    onSave(state)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">5. Résumé</h2>

      <div className="flex flex-col gap-2 p-4 border rounded bg-surface">
        <div>
          <strong>Titre:</strong> {quoi.titre}
        </div>
        <div>
          <strong>Montant:</strong> {quoi.montant} €
        </div>
        <div>
          <strong>Fournisseur:</strong> {quoi.fournisseur}
        </div>
        <hr className="my-2" />
        <div>
          <strong>Preuve:</strong> {preuve.photoUrl ? 'Photo jointe' : 'Aucune photo'}
        </div>
        <hr className="my-2" />
        <div>
          <strong>Zone/Phase:</strong> {imputation.zonePhaseId || 'N/A'}
        </div>
        <div>
          <strong>Intervention:</strong> {imputation.interventionId || 'N/A'}
        </div>
        <hr className="my-2" />
        <div>
          <strong>Refacturable:</strong> {statut.isRebillable ? 'Oui' : 'Non'}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={handlePrev}>
          Précédent
        </Button>
        <Button onClick={handleSave}>Sauvegarder</Button>
      </div>
    </div>
  )
}
