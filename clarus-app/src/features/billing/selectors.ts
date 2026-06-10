import type { Expense, Intervention } from '@/lib/domain'

export type BillingSummaryInput = {
  interventions: Intervention[]
  expenses: Expense[]
}

export const selectBillingSummary = ({ interventions, expenses }: BillingSummaryInput) => {
  const billableInterventions = interventions.filter(
    (intervention) => intervention.billingStatus === 'to_invoice' || intervention.isExtra === true,
  )

  const billableExpenses = expenses.filter(
    (expense) => expense.isRebillable === true && expense.status !== 'invoiced',
  )

  return {
    interventions: billableInterventions,
    expenses: billableExpenses,
  }
}
