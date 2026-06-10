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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !defaultHourlyRate) return

    await mockClarusRepository.createPerson({
      projectId: 'project-1',
      name,
      role,
      defaultHourlyRate: parseFloat(defaultHourlyRate),
    })

    router.back()
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter un membre">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4 flex-1 overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-[var(--radius-control)] border border-border bg-background text-foreground"
              placeholder="Ex: Jean Dupont"
              required
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
              className="p-3 rounded-[var(--radius-control)] border border-border bg-background text-foreground"
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
              className="p-3 rounded-[var(--radius-control)] border border-border bg-background text-foreground"
              placeholder="Ex: 45"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 p-4 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-semibold text-lg"
          >
            Ajouter à l'équipe
          </button>
        </form>
      </section>
    </FullScreenSlideModal>
  )
}
