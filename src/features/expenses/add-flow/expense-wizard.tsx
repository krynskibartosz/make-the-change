'use client'

import { useRouter } from 'next/navigation'
import { useReducer, useState } from 'react'
import { CURRENT_PROJECT_ID } from '@/lib/constants'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { StepImputation } from './components/step-imputation'
import { StepPreuve } from './components/step-preuve'
import { StepQuoi } from './components/step-quoi'
import { StepResume } from './components/step-resume'
import { StepStatut } from './components/step-statut'
import { expenseAddFlowReducer, initialExpenseAddFlowState } from './reducer'

export function ExpenseWizard() {
  const router = useRouter()
  const [state, dispatch] = useReducer(expenseAddFlowReducer, initialExpenseAddFlowState)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (finalState: typeof state) => {
    setIsSubmitting(true)
    try {
      let receiptPhotoId: string | undefined

      // S'il y a une photo uploadée, on la crée d'abord
      if (finalState.preuve.photoUrl) {
        const photo = await mockClarusRepository.createPhoto({
          projectId: CURRENT_PROJECT_ID,
          url: finalState.preuve.photoUrl,
          type: 'receipt',
          comment: `Reçu pour ${finalState.quoi.titre}`,
          takenAt: new Date().toISOString(),
        })
        receiptPhotoId = photo.id
      }

      await mockClarusRepository.createExpense({
        projectId: CURRENT_PROJECT_ID,
        interventionId: finalState.imputation.interventionId || undefined,
        description: finalState.quoi.titre,
        amount: Number.parseFloat(finalState.quoi.montant),
        supplier: finalState.quoi.fournisseur,
        date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
        isRebillable: finalState.statut.isRebillable,
        receiptPhotoId,
      })

      router.back()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
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
