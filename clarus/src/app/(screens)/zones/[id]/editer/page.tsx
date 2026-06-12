'use client'
import Form from 'next/form'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Zone } from '@/lib/schemas/clarus'
import { Screen } from '@/app/(screens)/_components/screen'
import { FloatingCTA } from '@/components/ui/floating-cta'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateZoneAction, deleteZoneAction } from '@/actions/zone-actions'

export default function EditerZonePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [zone, setZone] = useState<Zone | null>(null)
  
  const updateActionWithId = updateZoneAction.bind(null, params.id)
  const [state, action, isPending] = useActionState(updateActionWithId, null)

  const [type, setType] = useState<'simple' | 'technical'>('simple')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    mockClarusRepository.getZoneById(params.id).then((data) => {
      if (data) {
        setZone(data)
        setType(data.type)
      } else {
        router.push('/zones')
      }
    })
  }, [params.id, router])

  const handleDelete = async () => {
    if (confirm('Voulez-vous vraiment supprimer cette zone ?')) {
      setIsDeleting(true)
      try {
        await deleteZoneAction(params.id)
      } catch (err) {
        setIsDeleting(false)
      }
    }
  }

  if (!zone) return null

  return (
    <Screen title="Éditer la zone" backHref="/zones">
      <Form action={action} className="flex flex-col gap-6 pb-24">
        <div className="flex flex-col gap-2">
          <Input 
            label="Nom de la zone *"
            name="name"
            defaultValue={zone.name}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Type</label>
          <div className="flex gap-4 p-1 bg-surface border border-border/50 rounded-lg">
            <label className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer ${type === 'simple' ? 'bg-background shadow-sm border border-border/50 font-medium text-foreground' : 'text-muted-foreground'}`}>
              <input 
                type="radio" 
                name="type" 
                value="simple"
                checked={type === 'simple'}
                onChange={() => setType('simple')}
                className="hidden"
              />
              <span className="text-sm">Simple</span>
            </label>
            <label className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer ${type === 'technical' ? 'bg-background shadow-sm border border-border/50 font-medium text-foreground' : 'text-muted-foreground'}`}>
              <input 
                type="radio" 
                name="type" 
                value="technical"
                checked={type === 'technical'}
                onChange={() => setType('technical')}
                className="hidden"
              />
              <span className="text-sm">Technique</span>
            </label>
          </div>
        </div>

        {type === 'technical' && (
          <div className="flex flex-col gap-2">
            <Input 
              label="Code technique"
              name="technicalCode"
              defaultValue={zone.technicalCode || ''}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Textarea 
            label="Description"
            name="description"
            defaultValue={zone.description || ''}
            rows={4}
          />
        </div>

        <div className="mt-8">
          <Button 
            type="button"
            onClick={handleDelete} 
            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
            disabled={isDeleting || isPending}
          >
            Supprimer la zone
          </Button>
        </div>

        <FloatingCTA>
          <Button type="submit" className="w-full" disabled={isPending || isDeleting}>
            Enregistrer les modifications
          </Button>
        </FloatingCTA>
      </Form>
    </Screen>
  )
}
