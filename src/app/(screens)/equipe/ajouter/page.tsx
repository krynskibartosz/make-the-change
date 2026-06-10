'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

export default function AjouterMembreEquipePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [defaultHourlyRate, setDefaultHourlyRate] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !defaultHourlyRate) return

    await mockClarusRepository.createPerson({
      projectId: 'project-1',
      name,
      role,
      defaultHourlyRate: parseFloat(defaultHourlyRate),
      avatarUrl: avatarUrl || undefined,
    })

    router.back()
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter un membre">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-5">
          <form id="add-team-member-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            form="add-team-member-form"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Ajouter à l'équipe
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
