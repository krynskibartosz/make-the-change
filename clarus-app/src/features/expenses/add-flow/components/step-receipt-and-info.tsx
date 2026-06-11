'use client'

import type React from 'react'
import { useState } from 'react'
import { Camera, Image as ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button, StickyActionBar } from '@/components/ui'
import { Input } from '@/components/ui/input'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'
import { validateStepReceiptAndInfo } from '../validation'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
}

export function StepReceiptAndInfo({ state, dispatch }: Props) {
  const [error, setError] = useState<string | null>(null)
  const { receiptAndInfo } = state

  const handleNext = () => {
    const res = validateStepReceiptAndInfo(receiptAndInfo)
    if (!res.isValid) {
      setError(res.errors[0] ?? null)
      return
    }
    setError(null)
    dispatch({ type: 'NEXT_STEP' })
  }

  const handleSimulatePhoto = () => {
    dispatch({
      type: 'SET_RECEIPT_AND_INFO',
      payload: { photoUrl: 'https://placehold.co/600x800/png' },
    })
  }

  const handleRemovePhoto = () => {
    dispatch({
      type: 'SET_RECEIPT_AND_INFO',
      payload: { photoUrl: null },
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-28">

      {/* Photo du reçu */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Preuve d'achat</p>
        {!receiptAndInfo.photoUrl ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSimulatePhoto}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-5 text-sm font-semibold text-foreground hover:bg-surface-elevated transition-colors active:scale-[0.97]"
            >
              <Camera className="size-6 text-primary" />
              Photo ticket
            </button>
            <button
              onClick={handleSimulatePhoto}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-5 text-sm font-semibold text-foreground hover:bg-surface-elevated transition-colors active:scale-[0.97]"
            >
              <ImageIcon className="size-6 text-primary" />
              Galerie
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
              <CheckCircle2 className="size-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-bold text-success">Reçu ajouté</p>
                <p className="text-xs text-muted-foreground">La photo du ticket est bien enregistrée.</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] w-full max-h-64 overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={receiptAndInfo.photoUrl}
                alt="Aperçu du reçu"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="text-sm text-muted-foreground underline text-center"
            >
              Remplacer la photo
            </button>
          </div>
        )}
      </section>

      {/* Infos ticket */}
      <section className="grid gap-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Infos de l'achat</p>
        <div className="grid gap-4">
          <Input
            label="Qu'avez-vous acheté ?"
            placeholder="Ex: Vis à bois, protection sol, béton..."
            value={receiptAndInfo.titre}
            onChange={(e) =>
              dispatch({ type: 'SET_RECEIPT_AND_INFO', payload: { titre: e.target.value } })
            }
          />
          <Input
            label="Montant total (TTC)"
            type="number"
            placeholder="0,00"
            value={receiptAndInfo.montant}
            onChange={(e) =>
              dispatch({ type: 'SET_RECEIPT_AND_INFO', payload: { montant: e.target.value } })
            }
          />
          <Input
            label="Fournisseur"
            placeholder="Ex: Leroy Merlin, Brico Dépôt..."
            value={receiptAndInfo.fournisseur}
            onChange={(e) =>
              dispatch({ type: 'SET_RECEIPT_AND_INFO', payload: { fournisseur: e.target.value } })
            }
          />
        </div>
      </section>

      {error && (
        <p className="rounded-[var(--radius-card)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <StickyActionBar
        primaryAction={
          <Button fullWidth onClick={handleNext} rightIcon={<ChevronRight className="size-4" />}>
            Continuer
          </Button>
        }
      />
    </div>
  )
}
