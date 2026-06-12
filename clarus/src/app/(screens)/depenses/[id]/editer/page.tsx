'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { mockClarusRepository } from '@/lib/repositories'
import { Screen } from '../../../_components/screen'

export default function EditExpensePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  
  const [isLoading, setIsLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [supplier, setSupplier] = useState('')
  const [amount, setAmount] = useState('')
  const [isRebillable, setIsRebillable] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadExpense = useCallback(async () => {
    try {
      const expense = await mockClarusRepository.getExpenseById(id)
      if (expense) {
        setDescription(expense.description || '')
        setSupplier(expense.supplier || '')
        setAmount(expense.amount ? String(expense.amount) : '')
        setIsRebillable(!!expense.isRebillable)
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadExpense()
  }, [loadExpense])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await mockClarusRepository.updateExpense(id, {
        description,
        supplier,
        amount: parseFloat(amount) || 0,
        isRebillable
      })
      router.back()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await mockClarusRepository.deleteExpense(id)
      router.back()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Screen title="Éditer la dépense" backHref="/couts">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
        </div>
      </Screen>
    )
  }

  return (
    <Screen title="Éditer la dépense" backHref="/couts">
      <form onSubmit={handleSave} className="flex flex-col gap-6 pb-8">
        <section className="grid gap-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Infos de l'achat
          </p>
          <div className="grid gap-4">
            <Input
              label="Qu'avez-vous acheté ?"
              placeholder="Ex: Vis à bois, protection sol, béton..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              label="Montant total (TTC)"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Fournisseur"
              placeholder="Ex: Leroy Merlin, Brico Dépôt..."
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
        </section>

        <section className="grid gap-3 rounded-xl border border-border bg-surface p-4">
          <button
            type="button"
            onClick={() => setIsRebillable(!isRebillable)}
            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
              isRebillable
                ? 'border-warning/50 bg-warning/10'
                : 'border-border bg-background hover:bg-surface'
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                isRebillable
                  ? 'border-warning bg-warning'
                  : 'border-border bg-background'
              }`}
            >
              {isRebillable && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Supplément à refacturer</p>
              <p className="text-xs text-muted-foreground">
                Cette dépense sera facturée au client en plus du devis
              </p>
            </div>
          </button>
        </section>

        <section className="flex flex-col gap-3 mt-4">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Enregistrer
          </Button>
          <Button 
            type="button" 
            variant="danger" 
            fullWidth 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Supprimer la dépense
          </Button>
        </section>
      </form>
    </Screen>
  )
}
