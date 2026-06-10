'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { FullScreenSlideModal } from '@/app/@modal/_components/full-screen-slide-modal'

export function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [zoneId, setZoneId] = useState('')

  const handleCreate = () => {
    // We would normally call a server action or repository method here
    console.log({ title, assignedTo, zoneId })
    setIsOpen(false)
    setTitle('')
    setAssignedTo('')
    setZoneId('')
  }

  return (
    <>
      {/* Bouton flottant Ajouter une tâche */}
      <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),0.75rem)+5.5rem)] inset-x-0 z-40 flex justify-center px-5 pointer-events-none">
        <Button 
          className="pointer-events-auto h-14 w-full max-w-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-95 text-base"
          leftIcon={<Plus className="size-5" />} 
          onClick={() => setIsOpen(true)}
        >
          Ajouter une tâche
        </Button>
      </div>

      {isOpen && (
        <FullScreenSlideModal
          title="Nouvelle tâche"
          headerMode="close"
          onClose={() => setIsOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <Input
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Peinture du salon"
            />
            <Input
              label="Assigné à"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Ex: Jean Dupont"
            />
            <Input
              label="Zone"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="Ex: Zone A"
            />

            <div className="mt-4 flex gap-3">
              <Button fullWidth onClick={handleCreate}>
                Créer
              </Button>
            </div>
          </div>
        </FullScreenSlideModal>
      )}
    </>
  )
}
