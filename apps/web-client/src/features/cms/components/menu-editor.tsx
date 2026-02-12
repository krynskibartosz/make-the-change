'use client'

import { Button, Textarea } from '@make-the-change/core/ui'
import { useState, useTransition } from 'react'
import { updateMenu } from '@/features/cms/actions/cms-actions'
import type { MainMenuStructure } from '@/features/cms/types'
import { useToast } from '@/hooks/use-toast'

interface MenuEditorProps {
  initialData: MainMenuStructure | null
  slug: string
}

export function MenuEditor({ initialData, slug }: MenuEditorProps) {
  const [jsonContent, setJsonContent] = useState(JSON.stringify(initialData, null, 2))
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent)
      startTransition(async () => {
        try {
          await updateMenu(slug, parsed)
          toast({
            title: 'Succès',
            description: 'Le menu a été mis à jour avec succès.',
            variant: 'default',
          })
        } catch {
          toast({
            title: 'Erreur',
            description: 'Impossible de mettre à jour le menu.',
            variant: 'destructive',
          })
        }
      })
    } catch {
      toast({
        title: 'Erreur de format',
        description: 'Le JSON est invalide.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
      <Textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        className="font-mono min-h-[600px]"
      />
    </div>
  )
}
