import { ExpenseWizard } from '../../../features/expenses/add-flow/expense-wizard'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

export default function AjouterDepensePage() {
  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter une dépense">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4 flex-1 overflow-hidden flex flex-col">
        <ExpenseWizard />
      </section>
    </FullScreenSlideModal>
  )
}
