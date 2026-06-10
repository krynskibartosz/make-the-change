'use client'

import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button, FloatingCTA } from '@/components/ui'
import { selectBillingSummary } from '@/features/billing/selectors'
import type { Expense, Intervention, Photo } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { Screen } from '../_components/screen'

export default function FacturationPage() {
  const router = useRouter()

  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([])
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([])

  const loadData = useCallback(async () => {
    const [fetchedInterventions, fetchedExpenses, fetchedPhotos] = await Promise.all([
      mockClarusRepository.getInterventions(),
      mockClarusRepository.getExpenses(),
      mockClarusRepository.getPhotos(),
    ])
    setInterventions(fetchedInterventions)
    setExpenses(fetchedExpenses)
    setPhotos(fetchedPhotos)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const { interventions: billableInterventions, expenses: billableExpenses } = selectBillingSummary(
    {
      interventions,
      expenses,
    },
  )

  const toggleIntervention = (id: string) => {
    setSelectedInterventionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const toggleExpense = (id: string) => {
    setSelectedExpenseIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleInvoice = async () => {
    if (selectedInterventionIds.length === 0 && selectedExpenseIds.length === 0) return
    await mockClarusRepository.markAsInvoiced(selectedInterventionIds, selectedExpenseIds)
    setSelectedInterventionIds([])
    setSelectedExpenseIds([])
    await loadData()
  }

  const totalSelected = selectedInterventionIds.length + selectedExpenseIds.length

  return (
    <Screen title="Facturation" backHref="/couts">
      <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Interventions Facturables</h2>
          {billableInterventions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune intervention facturable.</p>
          ) : (
            <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
              {billableInterventions.map((item) => {
                const isSelected = selectedInterventionIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    className={`flex cursor-pointer items-center justify-between p-4 transition-colors border-b border-border last:border-0 ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleIntervention(item.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <div>
                      <div
                        className={`size-5 rounded-full border-2 ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <h2 className="mt-4 text-sm font-semibold text-foreground">Dépenses Facturables</h2>
          {billableExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune dépense facturable.</p>
          ) : (
            <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
              {billableExpenses.map((expense) => {
                const isSelected = selectedExpenseIds.includes(expense.id)
                const receiptPhoto = photos.find((p) => p.id === expense.receiptPhotoId)

                return (
                  <div
                    key={expense.id}
                    className={`flex cursor-pointer items-center justify-between p-4 transition-colors border-b border-border last:border-0 ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleExpense(expense.id)}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate pr-4">{expense.description}</span>
                      <span className="text-sm text-muted-foreground">{expense.amount} €</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {receiptPhoto ? (
                        <div className="relative size-10 rounded-md overflow-hidden bg-surface-elevated shrink-0 border border-border">
                          <Image src={receiptPhoto.url} alt="Reçu" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center size-10 rounded-md bg-surface-elevated shrink-0 border border-border border-dashed text-muted-foreground">
                          <ImageIcon className="size-4 opacity-50" />
                        </div>
                      )}

                      <div
                        className={`size-5 rounded-full border-2 ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </section>

      <FloatingCTA>
        <Button fullWidth disabled={totalSelected === 0} onClick={handleInvoice}>
          Marquer comme facturé ({totalSelected})
        </Button>
      </FloatingCTA>
    </Screen>
  )
}
