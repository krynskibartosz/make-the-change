'use client'
import Form from 'next/form'

import { useParams, useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { deletePersonAction, updatePersonAction } from '@/actions/team-actions'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../../@modal/_components/full-screen-slide-modal'

export default function EditerMembreEquipePage() {
  const router = useRouter()
  const params = useParams()
  const personId = params.id as string

  const [person, setPerson] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const updateActionWithId = updatePersonAction.bind(null, personId)
  const [state, action, isPending] = useActionState(updateActionWithId, null)

  useEffect(() => {
    const loadPerson = async () => {
      try {
        const loadedPerson = await mockClarusRepository.getPersonById(personId)
        if (loadedPerson) {
          setPerson(loadedPerson)
        } else {
          toast({ title: 'Membre introuvable', variant: 'error' })
          router.back()
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadPerson()
  }, [personId, router])

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      setIsDeleting(true)
      try {
        await deletePersonAction(personId)
        toast({ title: 'Membre supprimé ✓', variant: 'success' })
      } catch (e) {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <FullScreenSlideModal asPage headerMode="back" title="Éditer le membre">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Éditer le membre">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-5">
          <Form id="edit-team-member-form" action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={person.name}
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
                defaultValue={person.avatarUrl || ''}
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
                defaultValue={person.role || ''}
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
                defaultValue={person.defaultHourlyRate}
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
                defaultValue={person.company || ''}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Plomberie Dupont ou Interne"
              />
            </div>
          </Form>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 py-3.5 font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Supprimer le profil
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="edit-team-member-form"
            disabled={isPending || isDeleting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
