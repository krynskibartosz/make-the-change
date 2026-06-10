import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  Image as ImageIcon,
  MapPin,
  PackageCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type {
  Expense,
  Intervention,
  MaterialMovement,
  Phase,
  Photo,
  Task,
  WorkEntry,
  Zone,
} from '@/lib/domain/types'
import { type InterventionDetailTab, InterventionDetailTabs } from './intervention-detail-tabs'

function formatAmountNumber(amount: number | null | undefined): string {
  if (amount == null) return '0'
  return amount.toString()
}

type InterventionQuickViewProps = {
  intervention: Intervention
  workEntries: WorkEntry[]
  expenses: Expense[]
  tasks: Task[]
  photos: Photo[]
  phases: Phase[]
  zones: Zone[]
  materialMovements?: MaterialMovement[]
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
  )
}

function DataRow({
  label,
  value,
  isWarning = false,
}: {
  label: string
  value: React.ReactNode
  isWarning?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${isWarning ? 'text-warning' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

export function InterventionQuickView({
  intervention,
  workEntries,
  expenses,
  tasks,
  photos,
  phases,
  zones,
  materialMovements = [],
}: InterventionQuickViewProps) {
  const zoneName = zones.find((z) => z.id === intervention.zoneId)?.name || 'Zone non définie'
  const phaseName = phases.find((p) => p.id === intervention.phaseId)?.name || 'Phase non définie'

  const totalHours = workEntries.reduce((sum, entry) => sum + entry.durationMinutes / 60, 0)
  const totalExpenses = expenses.reduce((sum, entry) => sum + (entry.amount || 0), 0)

  const isComplete = intervention.status === 'done'
  const isToCheck =
    intervention.isExtra === 'to_check' || !intervention.zoneId || !intervention.phaseId

  const tabs: InterventionDetailTab[] = [
    {
      id: 'overview',
      label: 'Aperçu',
      content: (
        <div className="pt-6 px-4 space-y-8 pb-12">
          <section>
            <SectionHeading>Informations</SectionHeading>
            <div className="rounded-2xl border border-border bg-surface p-4 mt-2">
              <DataRow label="Titre" value={intervention.title} />
              <DataRow label="Type" value={intervention.type} />
              <DataRow
                label="Date"
                value={new Date(intervention.date || new Date()).toLocaleDateString('fr-FR')}
              />
              <DataRow label="Statut" value={isComplete ? 'Terminée' : 'En cours'} />
              <DataRow
                label="Vérification"
                value={isToCheck ? 'À vérifier' : 'Conforme'}
                isWarning={isToCheck}
              />
            </div>
          </section>

          <section>
            <SectionHeading>Localisation</SectionHeading>
            <div className="rounded-2xl border border-border bg-surface p-4 mt-2">
              <DataRow label="Zone" value={zoneName} />
              <DataRow label="Phase" value={phaseName} />
            </div>
          </section>

          {intervention.description && (
            <section>
              <SectionHeading>Description</SectionHeading>
              <div className="rounded-2xl border border-border bg-surface p-4 mt-2 text-sm text-foreground whitespace-pre-wrap">
                {intervention.description}
              </div>
            </section>
          )}

          {tasks.length > 0 && (
            <section>
              <SectionHeading>Tâches liées</SectionHeading>
              <div className="rounded-2xl border border-border bg-surface p-4 mt-2 space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    {task.status === 'done' ? (
                      <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded border border-muted-foreground shrink-0" />
                    )}
                    <span
                      className={`text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ),
      cta: (
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-surfaceElevated text-foreground py-3.5 font-semibold border border-border active:scale-[0.98] transition-all">
          Éditer l'intervention
        </button>
      ),
    },
    {
      id: 'hours',
      label: 'Heures',
      content: (
        <div className="pt-6 px-4 space-y-6 pb-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Entrées de travail</SectionHeading>
              <span className="text-sm font-bold text-primary">{totalHours}h au total</span>
            </div>

            {workEntries.length > 0 ? (
              <div className="space-y-3">
                {workEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-border bg-surface p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">{entry.personId}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.notes || 'Pas de notes'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{entry.durationMinutes / 60}h</p>
                      <p className="text-xs text-muted-foreground">
                        {formatAmountNumber(entry.amount)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground">Aucune heure enregistrée</p>
              </div>
            )}
          </section>
        </div>
      ),
      cta: (
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
          <Clock className="w-5 h-5" />
          Ajouter des heures
        </button>
      ),
    },
    {
      id: 'costs',
      label: 'Coûts',
      content: (
        <div className="pt-6 px-4 space-y-6 pb-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Dépenses liées</SectionHeading>
              <span className="text-sm font-bold text-primary">
                {formatAmountNumber(totalExpenses)} €
              </span>
            </div>

            {expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="rounded-xl border border-border bg-surface p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">{expense.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{expense.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatAmountNumber(expense.amount || 0)} €
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-surfaceElevated text-muted-foreground">
                        {expense.status === 'to_pay' ? 'À payer' : expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground">Aucune dépense enregistrée</p>
              </div>
            )}
          </section>
        </div>
      ),
      cta: (
        <Link
          href={`/ajouter-depense`}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <PackageCheck className="w-5 h-5" />
          Ajouter une dépense
        </Link>
      ),
    },
    {
      id: 'materials',
      label: 'Matériaux',
      content: (
        <div className="pt-6 px-4 space-y-6 pb-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Matériaux & Logistique</SectionHeading>
              <span className="text-sm font-bold text-muted-foreground">
                {materialMovements.length} flux
              </span>
            </div>

            {materialMovements.length > 0 ? (
              <div className="space-y-3">
                {materialMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="rounded-xl border border-border bg-surface p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">{movement.materialId}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {movement.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {movement.quantity} {movement.unit}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-surfaceElevated text-muted-foreground capitalize">
                        {movement.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground">Aucun mouvement de matériel</p>
              </div>
            )}
          </section>
        </div>
      ),
      cta: (
        <Link
          href={`/ajouter-materiau`}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <PackageCheck className="w-5 h-5" />
          Ajouter un matériel
        </Link>
      ),
    },
    {
      id: 'photos',
      label: 'Photos',
      content: (
        <div className="pt-6 px-4 space-y-6 pb-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Galerie</SectionHeading>
              <span className="text-sm font-bold text-muted-foreground">
                {photos.length} photo(s)
              </span>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-surfaceElevated"
                  >
                    {photo.url ? (
                      <Image src={photo.url} alt={photo.id} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground">Aucune photo pour l'instant</p>
              </div>
            )}
          </section>
        </div>
      ),
      cta: (
        <Link
          href={`/photos/ajouter?interventionId=${intervention.id}${intervention.zoneId ? `&zoneId=${intervention.zoneId}` : ''}`}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <ImageIcon className="w-5 h-5" />
          Ajouter une photo
        </Link>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Mini hero section for intervention */}
      <div className="px-4 pt-4 pb-6 bg-surfaceElevated">
        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
          {intervention.id}
        </p>
        <h1 className="text-2xl font-black text-foreground leading-tight">{intervention.title}</h1>
      </div>

      <InterventionDetailTabs tabs={tabs} />
    </div>
  )
}
