'use client'
import Form from 'next/form'

import { useActionState, useState } from 'react'
import { createZoneAction } from '@/actions/zone-actions'
import { Screen } from '@/app/(screens)/_components/screen'
import { Button } from '@/components/ui/button'
import { FloatingCTA } from '@/components/ui/floating-cta'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AjouterZonePage() {
  const [_state, action, isPending] = useActionState(createZoneAction, null)
  const [type, setType] = useState<'simple' | 'technical'>('simple')

  return (
    <Screen title="Nouvelle zone" backHref="/zones">
      <Form action={action} className="flex flex-col gap-6 pb-24">
        <div className="flex flex-col gap-2">
          <Input label="Nom de la zone *" name="name" placeholder="ex: RDC, Salon..." required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Type</label>
          <div className="flex gap-4 p-1 bg-surface border border-border/50 rounded-lg">
            <label
              className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer ${type === 'simple' ? 'bg-background shadow-sm border border-border/50 font-medium text-foreground' : 'text-muted-foreground'}`}
            >
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
            <label
              className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer ${type === 'technical' ? 'bg-background shadow-sm border border-border/50 font-medium text-foreground' : 'text-muted-foreground'}`}
            >
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
            <Input label="Code technique" name="technicalCode" placeholder="ex: ZT-01" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Textarea
            label="Description"
            name="description"
            placeholder="Informations supplémentaires..."
            rows={4}
          />
        </div>

        <FloatingCTA>
          <Button type="submit" className="w-full" disabled={isPending}>
            Créer la zone
          </Button>
        </FloatingCTA>
      </Form>
    </Screen>
  )
}
