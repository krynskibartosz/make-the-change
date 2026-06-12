'use client'

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Euro,
  ImageIcon,
  MessageCircleQuestion,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useReducer } from 'react'
import { useRole } from '@/lib/role-context'
import existingSurveyPhoto from '../../../../assets/plan/IMG_2581.jpeg'
import p17DetailPhoto from '../../../../assets/plan/IMG_2583.jpeg'
import { initialValidationFlowState, validationFlowReducer } from './validation-flow'

const decision = {
  option: 'Renfort complémentaire sous la dalle, option technique P1.7',
  delay: '+1 jour estimé',
  cost: '+540 € estimés',
}

const proofPhotos = [
  {
    alt: 'Mesure de l’épaisseur de la dalle existante',
    caption: "Relevé de l'existant avant intervention",
    url: existingSurveyPhoto.src,
  },
  {
    alt: 'Zone de structure concernée par le renfort P1.7',
    caption: 'Détail du renfort métallique P1.7',
    url: p17DetailPhoto.src,
  },
]

export default function ValidationsPage() {
  const { role, isReady } = useRole()
  const [flow, dispatch] = useReducer(validationFlowReducer, initialValidationFlowState)
  const isClient = role === 'client'
  const isAccepted = isClient && flow.status === 'accepted'

  if (!isReady) return null

  return (
    <div className="flex min-h-dvh flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex flex-col gap-1 border-b border-border/30 bg-background/90 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <h1 className="text-2xl font-semibold leading-tight">À valider</h1>
        {isClient ? (
          <p className="text-sm text-muted-foreground">
            Une décision expliquée simplement, avec ses preuves et ses impacts.
          </p>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-4">
        <section className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div
              className={`flex items-start gap-3 border-b p-4 ${
                isAccepted
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : 'border-orange-500/20 bg-orange-500/10'
              }`}
            >
              {isAccepted ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
              )}
              <div className="flex flex-col">
                <span
                  className={`mb-1 text-xs font-bold uppercase tracking-wider ${
                    isAccepted ? 'text-emerald-700' : 'text-orange-600'
                  }`}
                >
                  {isAccepted ? 'Accord enregistré' : 'En attente de votre accord'}
                </span>
                <h2 className="text-lg font-semibold">Choix technique P1.7</h2>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-4">
              <div className="flex flex-col gap-4">
                <DetailBlock title="Situation">
                  Lors de la démolition de la terrasse extérieure, l'équipe a découvert une dalle de
                  béton plus épaisse que celle indiquée dans les informations de départ.
                </DetailBlock>
                <DetailBlock title="Pourquoi votre accord est nécessaire">
                  Cette épaisseur impose un renfort complémentaire avant de poursuivre la structure.
                  L'option P1.7 permet de reprendre correctement les charges et de sécuriser la
                  nouvelle dalle.
                </DetailBlock>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Preuves du terrain
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {isClient
                    ? proofPhotos.map((photo) => (
                        <figure
                          key={photo.caption}
                          className="overflow-hidden rounded-xl border border-border/50 bg-surface-elevated"
                        >
                          <img
                            src={photo.url}
                            alt={photo.alt}
                            className="h-24 w-full object-cover"
                          />
                          <figcaption className="p-2 text-xs font-medium leading-snug">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      ))
                    : ['Épaisseur de la dalle', 'Option technique P1.7'].map((label) => (
                        <div
                          key={label}
                          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface-elevated"
                        >
                          <ImageIcon className="size-6 text-muted-foreground/50" />
                          <span className="px-1 text-center text-[10px] font-medium text-muted-foreground">
                            {label}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Impact estimé
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Impact icon={<Clock className="size-5 text-blue-500" />} label="Délai">
                    +1 jour
                  </Impact>
                  <Impact icon={<Euro className="size-5 text-red-500" />} label="Coût">
                    +540 €
                  </Impact>
                </div>
              </div>

              {isClient ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Conséquence si vous attendez
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    La préparation de la structure restera en pause. Chaque jour sans décision peut
                    décaler les interventions suivantes au-delà du jour déjà estimé.
                  </p>
                </div>
              ) : null}

              {flow.status === 'clarification-sent' ? (
                <div
                  className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4"
                  role="status"
                >
                  <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold">Votre demande de précision est envoyée</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Le chef de chantier reviendra vers vous avant toute validation.
                    </p>
                  </div>
                </div>
              ) : null}

              {flow.status === 'accepted' ? (
                <div
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                  role="status"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">{flow.receipt.statusLabel}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Référence {flow.receipt.reference}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 grid gap-2 border-t border-emerald-500/20 pt-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Option</dt>
                      <dd className="text-right font-medium">P1.7 avec renfort</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Estimation</dt>
                      <dd className="text-right font-medium">+1 jour · +540 €</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs font-semibold text-emerald-800">
                    Simulation uniquement. {flow.receipt.disclaimer}.
                  </p>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={isClient ? () => dispatch({ type: 'request-acceptance' }) : undefined}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="size-5" />
                    Accepter l'option et le supplément
                  </button>
                  <button
                    type="button"
                    disabled={isClient && flow.status === 'clarification-sent'}
                    onClick={
                      isClient ? () => dispatch({ type: 'request-clarification' }) : undefined
                    }
                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 py-3 font-medium text-foreground transition-colors hover:bg-surface-elevated disabled:opacity-60"
                  >
                    {flow.status === 'clarification-sent'
                      ? 'Précision demandée'
                      : 'Demander une précision'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 flex flex-col gap-3">
          <h2 className="px-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Déjà validé
          </h2>
          <div className="flex flex-col gap-3">
            <HistoryItem date="Validé le 8 juin">Protection de l'escalier</HistoryItem>
            <HistoryItem date="Validé le 9 juin">Enlèvement conteneur</HistoryItem>
          </div>
        </section>
      </main>

      {isClient && flow.status === 'confirming' ? (
        <div
          className="fixed inset-0 z-[100] flex items-end bg-black/60 p-3 sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-background p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Confirmation
                </p>
                <h2 id="confirmation-title" className="mt-1 text-xl font-semibold">
                  Confirmer votre accord
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fermer la confirmation"
                onClick={() => dispatch({ type: 'cancel-confirmation' })}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Vous confirmez l'option suivante pour permettre la reprise du chantier :
            </p>
            <div className="mt-3 rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold">{decision.option}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <span className="rounded-lg bg-surface-elevated p-3 font-medium">
                  {decision.delay}
                </span>
                <span className="rounded-lg bg-surface-elevated p-3 font-medium">
                  {decision.cost}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Cette démonstration n'envoie aucune commande et ne constitue pas un engagement
              contractuel.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: 'confirm-acceptance' })}
                className="min-h-12 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
              >
                Confirmer l'accord simulé
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'cancel-confirmation' })}
                className="min-h-11 w-full rounded-xl border border-border px-4 py-3 font-medium"
              >
                Revenir à la demande
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function DetailBlock({ children, title }: Readonly<{ children: string; title: string }>) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  )
}

function Impact({
  children,
  icon,
  label,
}: Readonly<{ children: string; icon: React.ReactNode; label: string }>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface-elevated p-3">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{children}</span>
      </div>
    </div>
  )
}

function HistoryItem({ children, date }: Readonly<{ children: string; date: string }>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 opacity-75">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-5 text-emerald-500" />
        <span className="text-sm font-medium">{children}</span>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
    </div>
  )
}
