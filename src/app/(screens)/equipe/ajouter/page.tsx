'use client'
import Form from 'next/form'

import { useActionState } from 'react'
import { createPersonAction } from '@/actions/team-actions'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

export default function AjouterMembreEquipePage() {
  const [state, action, isPending] = useActionState(createPersonAction, null)

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter un membre">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-5">
          <Form id="add-team-member-form" action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="avatarUrl" className="text-sm font-medium">
                Photo de profil (URL optionnelle)
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Rôle
              </label>
              <input
                id="role"
                name="role"
                type="text"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Électricien"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="defaultHourlyRate" className="text-sm font-medium">
                Taux horaire par défaut (€/h)
              </label>
              <input
                id="defaultHourlyRate"
                name="defaultHourlyRate"
                type="number"
                step="0.01"
                min="0"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: 45"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-sm font-medium">
                Entreprise / Sous-traitant
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Plomberie Dupont ou Interne"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: 06 12 34 56 78"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: jean@dupont.fr"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="skills" className="text-sm font-medium">
                Compétences (séparées par des virgules)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Plomberie, Chauffage"
              />
            </div>
          </Form>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="add-team-member-form"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            Ajouter à l'équipe
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
