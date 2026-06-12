'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle2, Image as ImageIcon, Mail, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Button, FloatingCTA, SegmentedControl } from '@/components/ui'
import type { Expense, Intervention, Photo, WorkEntry } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { Screen } from '../_components/screen'

export default function FacturationPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')

  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])

  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([])
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([])

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastInvoicedAmount, setLastInvoicedAmount] = useState(0)

  const loadData = useCallback(async () => {
    const [fetchedInterventions, fetchedWorkEntries, fetchedExpenses, fetchedPhotos] =
      await Promise.all([
        mockClarusRepository.getInterventions(),
        mockClarusRepository.getWorkEntries(),
        mockClarusRepository.getExpenses(),
        mockClarusRepository.getPhotos(),
      ])
    setInterventions(fetchedInterventions)
    setWorkEntries(fetchedWorkEntries)
    setExpenses(fetchedExpenses)
    setPhotos(fetchedPhotos)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getInterventionAmount = (id: string) => {
    return workEntries.filter((e) => e.interventionId === id).reduce((sum, e) => sum + e.amount, 0)
  }

  // Filter pending billable items
  const billableInterventions = interventions.filter(
    (i) => i.billingStatus === 'to_invoice' || i.isExtra === true,
  )
  const billableExpenses = expenses.filter(
    (e) => e.isRebillable === true && e.status !== 'invoiced',
  )

  // Filter history (already invoiced)
  const historyInterventions = interventions.filter(
    (i) => i.billingStatus === 'invoiced' || i.billingStatus === 'paid',
  )
  const historyExpenses = expenses.filter((e) => e.status === 'invoiced' || e.status === 'paid')

  // Toggle selection
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

  // Invoice action
  const handleInvoice = async () => {
    if (selectedInterventionIds.length === 0 && selectedExpenseIds.length === 0) return

    // Save amount for success modal before clearing
    setLastInvoicedAmount(totalSelectedAmount)

    await mockClarusRepository.markAsInvoiced(selectedInterventionIds, selectedExpenseIds)
    setSelectedInterventionIds([])
    setSelectedExpenseIds([])
    await loadData()
    setShowSuccessModal(true)
  }

  // Calculate totals for CTA
  const totalSelectedCount = selectedInterventionIds.length + selectedExpenseIds.length
  const totalSelectedAmount =
    billableInterventions
      .filter((i) => selectedInterventionIds.includes(i.id))
      .reduce((sum, i) => sum + getInterventionAmount(i.id), 0) +
    billableExpenses
      .filter((e) => selectedExpenseIds.includes(e.id))
      .reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <Screen title="Facturation" backHref="/couts">
      <div className="mb-6">
        <SegmentedControl
          ariaLabel="Vue de la facturation"
          options={[
            { value: 'pending', label: 'À facturer' },
            { value: 'history', label: 'Historique' },
          ]}
          value={activeTab}
          onValueChange={(id) => setActiveTab(id as 'pending' | 'history')}
        />
      </div>

      {activeTab === 'pending' && (
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Interventions
            </h2>
            {billableInterventions.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-surface p-4 rounded-xl border border-border text-center">
                Aucune intervention à facturer.
              </p>
            ) : (
              <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
                {billableInterventions.map((item) => {
                  const isSelected = selectedInterventionIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors border-b border-border last:border-0 ${
                        isSelected ? 'border-primary bg-primary/5' : 'active:bg-surface-elevated'
                      }`}
                      onClick={() => toggleIntervention(item.id)}
                    >
                      <div className="flex flex-col flex-1 min-w-0 pr-4">
                        <span className="font-semibold text-foreground truncate">{item.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {item.date
                              ? format(new Date(item.date), 'dd MMM yyyy', { locale: fr })
                              : 'Date inconnue'}
                          </span>
                          {item.isExtra && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">
                              Extra
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold">{getInterventionAmount(item.id)} €</span>
                        <div
                          className={`size-5 rounded-full border-2 transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/50 bg-transparent'
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Dépenses & Achats
            </h2>
            {billableExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-surface p-4 rounded-xl border border-border text-center">
                Aucune dépense à facturer.
              </p>
            ) : (
              <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
                {billableExpenses.map((expense) => {
                  const isSelected = selectedExpenseIds.includes(expense.id)
                  const receiptPhoto = photos.find((p) => p.id === expense.receiptPhotoId)

                  return (
                    <div
                      key={expense.id}
                      className={`flex cursor-pointer items-start justify-between p-4 transition-colors border-b border-border last:border-0 ${
                        isSelected ? 'border-primary bg-primary/5' : 'active:bg-surface-elevated'
                      }`}
                      onClick={() => toggleExpense(expense.id)}
                    >
                      <div className="flex gap-3 flex-1 min-w-0 pr-4">
                        {receiptPhoto ? (
                          <div className="relative size-12 rounded-lg overflow-hidden bg-surface-elevated shrink-0 border border-border">
                            <Image
                              src={receiptPhoto.url}
                              alt="Reçu"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center size-12 rounded-lg bg-surface-elevated shrink-0 border border-border border-dashed text-muted-foreground/50">
                            <ImageIcon className="size-5" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 pt-0.5">
                          <span className="font-semibold text-foreground truncate">
                            {expense.description}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1 truncate">
                            {expense.supplier || 'Sans fournisseur'} •{' '}
                            {format(new Date(expense.date), 'dd MMM', { locale: fr })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pt-1">
                        <span className="font-bold">{expense.amount || 0} €</span>
                        <div
                          className={`size-5 rounded-full border-2 transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/50 bg-transparent'
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'history' && (
        <section className="flex flex-col gap-6 opacity-70">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Historique des Interventions
            </h2>
            {historyInterventions.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-surface p-4 rounded-xl border border-border text-center">
                Aucun historique.
              </p>
            ) : (
              <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
                {historyInterventions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border-b border-border last:border-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">Facturé</span>
                    </div>
                    <span className="font-semibold">{getInterventionAmount(item.id)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Historique des Dépenses
            </h2>
            {historyExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-surface p-4 rounded-xl border border-border text-center">
                Aucun historique.
              </p>
            ) : (
              <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
                {historyExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border-b border-border last:border-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{expense.description}</span>
                      <span className="text-xs text-muted-foreground mt-1">Facturé</span>
                    </div>
                    <span className="font-semibold">{expense.amount || 0} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'pending' && (
        <FloatingCTA>
          <Button fullWidth disabled={totalSelectedCount === 0} onClick={handleInvoice}>
            {totalSelectedCount > 0
              ? `Facturer — ${totalSelectedAmount.toLocaleString('fr-FR')} € (${totalSelectedCount})`
              : 'Marquer comme facturé'}
          </Button>
        </FloatingCTA>
      )}

      {/* Modal de Succès (Post-Facturation) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                <CheckCircle2 className="size-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Éléments validés !</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Un montant total de{' '}
                  <strong className="text-foreground">
                    {lastInvoicedAmount.toLocaleString('fr-FR')} €
                  </strong>{' '}
                  a été marqué comme facturé.
                </p>
              </div>

              <div className="w-full h-px bg-border my-2" />

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 w-full text-left">
                Informer le client
              </p>

              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=Bonjour,%20voici%20le%20récapitulatif%20des%20derniers%20suppléments%20du%20chantier%20(${lastInvoicedAmount}%20€).%20Merci%20!`,
                    )
                    setShowSuccessModal(false)
                  }}
                  className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] p-4 rounded-2xl active:scale-95 transition-all"
                >
                  <MessageCircle className="size-6" />
                  <span className="text-xs font-bold">WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      `mailto:?subject=Facturation%20Chantier&body=Bonjour,%20voici%20le%20récapitulatif%20des%20derniers%20suppléments%20du%20chantier%20(${lastInvoicedAmount}%20€).%20Merci%20!`,
                    )
                    setShowSuccessModal(false)
                  }}
                  className="flex-1 flex flex-col items-center justify-center gap-2 bg-blue-500/10 text-blue-500 p-4 rounded-2xl active:scale-95 transition-all"
                >
                  <Mail className="size-6" />
                  <span className="text-xs font-bold">Email</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="mt-2 text-sm font-bold text-muted-foreground py-2 px-4 rounded-full hover:bg-surface-elevated transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}
