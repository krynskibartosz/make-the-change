'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card, IconButton } from '@/components/ui'
import { selectBillingSummary } from '@/features/billing/selectors'
import type { Expense, Intervention } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

export default function FacturationPage() {
  const router = useRouter()

  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([])
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([])

  const loadData = useCallback(async () => {
    const [fetchedInterventions, fetchedExpenses] = await Promise.all([
      mockClarusRepository.getInterventions(),
      Promise.resolve([] as Expense[]),
    ])
    setInterventions(fetchedInterventions)
    setExpenses(fetchedExpenses)
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
    <div className="min-h-dvh bg-background pb-20 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col px-5">
        <header className="mb-6 flex items-center gap-3">
          <IconButton aria-label="Retour" onClick={() => router.back()} variant="secondary">
            <ChevronLeft className="size-5" />
          </IconButton>
          <h1 className="text-2xl font-bold">Facturation</h1>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Interventions Facturables</h2>
          {billableInterventions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune intervention facturable.</p>
          ) : (
            billableInterventions.map((item) => {
              const isSelected = selectedInterventionIds.includes(item.id)
              return (
                <Card
                  key={item.id}
                  className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
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
                </Card>
              )
            })
          )}

          <h2 className="mt-4 text-sm font-semibold text-foreground">Dépenses Facturables</h2>
          {billableExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune dépense facturable.</p>
          ) : (
            billableExpenses.map((expense) => {
              const isSelected = selectedExpenseIds.includes(expense.id)
              return (
                <Card
                  key={expense.id}
                  className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => toggleExpense(expense.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{expense.description}</span>
                    <span className="text-sm text-muted-foreground">{expense.amount} €</span>
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
                </Card>
              )
            })
          )}
        </section>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <div className="mx-auto max-w-md">
            <Button fullWidth disabled={totalSelected === 0} onClick={handleInvoice}>
              Marquer comme facturé ({totalSelected})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
