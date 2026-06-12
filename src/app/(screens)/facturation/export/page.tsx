'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, Printer } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Expense, Intervention, WorkEntry, Person } from '@/lib/domain'

function InvoiceContent() {
  const searchParams = useSearchParams()
  const iParam = searchParams.get('i')
  const eParam = searchParams.get('e')
  
  const interventionIds = iParam ? iParam.split(',') : []
  const expenseIds = eParam ? eParam.split(',') : []

  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [people, setPeople] = useState<Person[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [fetchedInterventions, fetchedWorkEntries, fetchedExpenses, fetchedPeople, fetchedProject] =
      await Promise.all([
        mockClarusRepository.getInterventions(),
        mockClarusRepository.getWorkEntries(),
        mockClarusRepository.getExpenses(),
        mockClarusRepository.getPeople(),
        mockClarusRepository.getProject(),
      ])
      
    setInterventions(fetchedInterventions.filter(i => interventionIds.includes(i.id)))
    setWorkEntries(fetchedWorkEntries)
    setExpenses(fetchedExpenses.filter(e => expenseIds.includes(e.id)))
    setPeople(fetchedPeople)
    setProject(fetchedProject)
    setLoading(false)
  }, [iParam, eParam])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <div className="p-8 text-center font-medium">Création de la facture...</div>

  if (interventions.length === 0 && expenses.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Aucun élément sélectionné pour la facture.</p>
        <button type="button" onClick={() => window.history.back()} className="mt-4 text-primary font-bold">Retour</button>
      </div>
    )
  }

  const getInterventionAmount = (id: string) => {
    return workEntries.filter((e) => e.interventionId === id).reduce((sum, e) => sum + e.amount, 0)
  }

  const getWorkerNames = (id: string) => {
    const entries = workEntries.filter((e) => e.interventionId === id)
    const pIds = Array.from(new Set(entries.map(e => e.personId)))
    return pIds.map(pid => people.find(p => p.id === pid)?.name || 'Inconnu').join(', ')
  }

  const totalInterventions = interventions.reduce((sum, i) => sum + getInterventionAmount(i.id), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const subTotal = totalInterventions + totalExpenses
  const taxRate = 0.21 // 21% TVA standard
  const taxAmount = subTotal * taxRate
  const totalAmount = subTotal + taxAmount
  
  const invoiceNumber = `F-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans print:bg-white print:m-0 print:p-0">
      {/* Barre d'outils (invisible à l'impression) */}
      <div className="flex items-center justify-between p-4 bg-white border-b print:hidden shadow-sm">
        <button 
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-4" />
          Retour
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-all hover:bg-primary/90"
        >
          <Printer className="size-4" />
          Imprimer / PDF
        </button>
      </div>

      {/* Feuille A4 */}
      <div className="max-w-[210mm] mx-auto bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0 mt-8 mb-8 print:mt-0 print:mb-0">
        
        {/* En-tête */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight mb-2">CLARUS</h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Clarus Construction SRL<br/>
              123 Avenue des Bâtisseurs<br/>
              1000 Bruxelles, Belgique<br/>
              TVA: BE 0123.456.789
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-neutral-200 uppercase tracking-widest mb-2">Facture</h2>
            <p className="text-sm font-semibold text-neutral-800">N° {invoiceNumber}</p>
            <p className="text-sm text-neutral-500">Date: {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
          </div>
        </div>

        {/* Client & Projet */}
        <div className="flex justify-between mb-12 bg-neutral-50 p-6 rounded-2xl print:bg-transparent print:border print:border-neutral-200 print:p-4">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Facturé à</h3>
            <p className="font-bold text-lg text-neutral-900">{project?.clientName || 'Client Inconnu'}</p>
            <p className="text-sm text-neutral-600">
              {project?.address || 'Adresse inconnue'}<br/>
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Projet</h3>
            <p className="font-bold text-lg text-neutral-900">{project?.name || 'Projet Inconnu'}</p>
            <p className="text-sm text-neutral-600">Ref: {project?.id || ''}</p>
          </div>
        </div>

        {/* Tableau des interventions */}
        {interventions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b border-neutral-200 pb-2">Travaux & Interventions</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200">
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Intervenants</th>
                  <th className="pb-2 font-semibold text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-neutral-900">{item.title}</p>
                      {item.date && <p className="text-xs text-neutral-500">{format(new Date(item.date), 'dd/MM/yyyy')}</p>}
                    </td>
                    <td className="py-3 text-neutral-600">{getWorkerNames(item.id)}</td>
                    <td className="py-3 text-right font-bold whitespace-nowrap text-neutral-900">{getInterventionAmount(item.id).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tableau des dépenses */}
        {expenses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b border-neutral-200 pb-2">Achats & Dépenses (Refacturables)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200">
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Fournisseur</th>
                  <th className="pb-2 font-semibold text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-neutral-900">{expense.description}</p>
                      {expense.date && <p className="text-xs text-neutral-500">{format(new Date(expense.date), 'dd/MM/yyyy')}</p>}
                    </td>
                    <td className="py-3 text-neutral-600">{expense.supplier || '-'}</td>
                    <td className="py-3 text-right font-bold whitespace-nowrap text-neutral-900">{(expense.amount || 0).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totaux */}
        <div className="flex justify-end mt-8 border-t border-neutral-200 pt-8">
          <div className="w-80">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-neutral-500 font-medium">Sous-total HT</span>
              <span className="font-bold text-neutral-900">{subTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">TVA (21%)</span>
              <span className="font-bold text-neutral-900">{taxAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-black text-primary">
              <span>Total TTC</span>
              <span>{totalAmount.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Pied de page / Conditions */}
        <div className="mt-24 pt-8 border-t border-neutral-200 text-xs text-neutral-400 text-center print:mt-32">
          <p className="font-medium">Conditions de paiement : 30 jours fin de mois. En cas de retard de paiement, une indemnité forfaitaire de 10% sera appliquée.</p>
          <p className="mt-1">Merci de votre confiance.</p>
        </div>

      </div>
    </div>
  )
}

export default function ExportInvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground font-medium">Chargement de la facture...</div>}>
      <InvoiceContent />
    </Suspense>
  )
}
