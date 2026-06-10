import type React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'
import { validateStepQuoi } from '../validation'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

export function StepQuoi({ state, dispatch }: Props) {
  const { quoi } = state
  const validation = validateStepQuoi(quoi)

  const handleNext = () => {
    if (validation.isValid) {
      dispatch({ type: 'NEXT_STEP' })
    } else {
      alert(validation.errors.join('\n'))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">1. Quoi ?</h2>

      <div className="flex flex-col gap-2">
        <Input
          label="Titre"
          value={quoi.titre}
          onChange={(e) => dispatch({ type: 'SET_QUOI', payload: { titre: e.target.value } })}
          placeholder="Ex: Achat de matériel"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Montant (€)"
          type="number"
          value={quoi.montant}
          onChange={(e) => dispatch({ type: 'SET_QUOI', payload: { montant: e.target.value } })}
          placeholder="Ex: 150.00"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Fournisseur"
          value={quoi.fournisseur}
          onChange={(e) => dispatch({ type: 'SET_QUOI', payload: { fournisseur: e.target.value } })}
          placeholder="Ex: Leroy Merlin"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleNext}>Suivant</Button>
      </div>
    </div>
  )
}
