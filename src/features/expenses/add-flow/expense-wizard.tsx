'use client'

import { useRouter } from 'next/navigation'
import { useReducer, useState } from 'react'
import { CURRENT_PROJECT_ID } from '@/lib/constants'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { StepLinkToProject } from './components/step-link-to-project'
import { StepReceiptAndInfo } from './components/step-receipt-and-info'
import { StepResume } from './components/step-resume'
import { expenseAddFlowReducer, initialExpenseAddFlowState } from './reducer'

export function ExpenseWizard() {
  const router = useRouter()
  const [state, dispatch] = useReducer(expenseAddFlowReducer, initialExpenseAddFlowState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (finalState: typeof state) => {
    setIsSubmitting(true)
    try {
      let receiptPhotoId: string | undefined

      if (finalState.receiptAndInfo.photoUrl) {
        const photo = await mockClarusRepository.createPhoto({
          projectId: CURRENT_PROJECT_ID,
          url: finalState.receiptAndInfo.photoUrl,
          type: 'receipt',
          comment: `Reçu pour ${finalState.receiptAndInfo.titre}`,
          takenAt: new Date().toISOString(),
        })
        receiptPhotoId = photo.id
      }

      await mockClarusRepository.createExpense({
        projectId: CURRENT_PROJECT_ID,
        interventionId:
          finalState.linkToProject.linkType === 'intervention' &&
          finalState.linkToProject.interventionId
            ? finalState.linkToProject.interventionId
            : undefined,
        description: finalState.receiptAndInfo.titre,
        amount: Number.parseFloat(finalState.receiptAndInfo.montant),
        supplier: finalState.receiptAndInfo.fournisseur,
        date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
        isRebillable: finalState.linkToProject.isRebillable,
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
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded ${state.step >= step ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.step === 1 && <StepReceiptAndInfo state={state} dispatch={dispatch} />}
        {state.step === 2 && <StepLinkToProject state={state} dispatch={dispatch} />}
        {state.step === 3 && <StepResume state={state} dispatch={dispatch} onSave={handleSave} />}
      </div>
    </div>
  )
}
