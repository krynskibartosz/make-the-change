'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../../@modal/_components/full-screen-slide-modal'

export default function EditerMembreEquipePage() {
  const router = useRouter()
  const params = useParams()
  const personId = params.id as string

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [defaultHourlyRate, setDefaultHourlyRate] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPerson = async () => {
      try {
        const people = await mockClarusRepository.getPeople()
        const person = people.find((p) => p.id === personId)
        if (person) {
          setName(person.name)
          setRole(person.role || '')
          setDefaultHourlyRate(person.defaultHourlyRate.toString())
          setAvatarUrl(person.avatarUrl || '')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !defaultHourlyRate) return

    await mockClarusRepository.updatePerson(personId, {
      name,
      role,
      defaultHourlyRate: parseFloat(defaultHourlyRate),
      avatarUrl: avatarUrl || undefined,
    })

    toast({ title: 'Membre mis à jour ✓', variant: 'success' })
    router.back()
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
          <form id="edit-team-member-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
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
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Électricien"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rate" className="text-sm font-medium">
                Taux horaire par défaut (€/h)
              </label>
              <input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                value={defaultHourlyRate}
                onChange={(e) => setDefaultHourlyRate(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: 45"
                required
              />
            </div>
          </form>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="edit-team-member-form"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
