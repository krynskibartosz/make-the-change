'use client'

import { useRouter } from 'next/navigation'
import { useReducer } from 'react'
import { StepImputation } from './components/step-imputation'
import { StepPreuve } from './components/step-preuve'
import { StepQuoi } from './components/step-quoi'
import { StepResume } from './components/step-resume'
import { StepStatut } from './components/step-statut'
import { expenseAddFlowReducer, initialExpenseAddFlowState } from './reducer'

export function ExpenseWizard() {
  const router = useRouter()
  const [state, dispatch] = useReducer(expenseAddFlowReducer, initialExpenseAddFlowState)

  const handleSave = async (finalState: typeof state) => {
    // Dans une implémentation réelle, on appellerait une mutation / action server ici
    console.log('Expense saved:', finalState)
    router.back() // Fermer la modale
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded ${state.step >= step ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.step === 1 && <StepQuoi state={state} dispatch={dispatch} />}
        {state.step === 2 && <StepPreuve state={state} dispatch={dispatch} />}
        {state.step === 3 && <StepImputation state={state} dispatch={dispatch} />}
        {state.step === 4 && <StepStatut state={state} dispatch={dispatch} />}
        {state.step === 5 && <StepResume state={state} dispatch={dispatch} onSave={handleSave} />}
      </div>
    </div>
  )
}
