'use client'

import { Button, Textarea, Label, Input } from '@make-the-change/core/ui'
import { useState, useTransition } from 'react'
import { updatePageContent } from '@/features/cms/actions/cms-actions'
import { HomePageContent } from '@/features/cms/types'
import { useToast } from '@/hooks/use-toast'
import { EditorComponent } from './editor/editor-component'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@make-the-change/core/ui'

interface PageEditorProps {
  initialData: HomePageContent | null
  slug: string
}

export function PageEditor({ initialData, slug }: PageEditorProps) {
  // We keep a local copy of the full object to update
  const [content, setContent] = useState<HomePageContent>(initialData || {} as HomePageContent)
  const [jsonMode, setJsonMode] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updatePageContent(slug, content)
        toast({
          title: 'Succès',
          description: 'Le contenu de la page a été mis à jour.',
          variant: 'default',
        })
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour la page.',
          variant: 'destructive',
        })
      }
    })
  }

  const updateField = (path: string, value: string) => {
    setContent(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  // Helper to get nested value safely
  const getValue = (path: string) => {
    const keys = path.split('.')
    let current: any = content
    for (const key of keys) {
      if (current === undefined || current === null) return ''
      current = current[key]
    }
    return current || ''
  }

  if (jsonMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setJsonMode(false)}>Mode Visuel</Button>
          <Button onClick={() => {
             // In JSON mode, we save directly from the textarea value (not implemented here for brevity, 
             // but typically you'd have a separate state for the raw JSON string)
             handleSave() 
          }} disabled={isPending}>
            {isPending ? 'Enregistrement...' : 'Enregistrer JSON'}
          </Button>
        </div>
        <Textarea
          value={JSON.stringify(content, null, 2)}
          onChange={(e) => {
            try {
              setContent(JSON.parse(e.target.value))
            } catch (e) {
              // Ignore parse errors while typing
            }
          }}
          className="font-mono min-h-[800px]"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 border-b">
        <h2 className="text-xl font-semibold">Éditeur Visuel</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setJsonMode(true)}>Mode JSON (Avancé)</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="cta">Appel à l'action</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Titre Principal</Label>
            <Input 
              value={getValue('hero.title')} 
              onChange={(e) => updateField('hero.title', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sous-titre (Description)</Label>
            <EditorComponent 
              content={getValue('hero.subtitle')} 
              onChange={(val) => updateField('hero.subtitle', val)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input 
                value={getValue('hero.badge')} 
                onChange={(e) => updateField('hero.badge', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Bouton Principal</Label>
              <Input 
                value={getValue('hero.cta_primary')} 
                onChange={(e) => updateField('hero.cta_primary', e.target.value)} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Label Projets</Label>
              <Input value={getValue('stats.projects')} onChange={(e) => updateField('stats.projects', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Label Membres</Label>
              <Input value={getValue('stats.members')} onChange={(e) => updateField('stats.members', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Label Impact Global</Label>
              <Input value={getValue('stats.global_impact')} onChange={(e) => updateField('stats.global_impact', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valeur Points Générés</Label>
              <Input value={getValue('stats.points_generated')} onChange={(e) => updateField('stats.points_generated', e.target.value)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Titre de la section</Label>
            <Input value={getValue('features.title')} onChange={(e) => updateField('features.title', e.target.value)} />
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-bold">Investir</h3>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input value={getValue('features.invest.title')} onChange={(e) => updateField('features.invest.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={getValue('features.invest.description')} onChange={(e) => updateField('features.invest.description', e.target.value)} />
              </div>
            </div>

            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-bold">Gagner</h3>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input value={getValue('features.earn.title')} onChange={(e) => updateField('features.earn.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={getValue('features.earn.description')} onChange={(e) => updateField('features.earn.description', e.target.value)} />
              </div>
            </div>

            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-bold">Utiliser</h3>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input value={getValue('features.redeem.title')} onChange={(e) => updateField('features.redeem.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={getValue('features.redeem.description')} onChange={(e) => updateField('features.redeem.description', e.target.value)} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cta" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={getValue('cta.title')} onChange={(e) => updateField('cta.title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <EditorComponent 
              content={getValue('cta.description')} 
              onChange={(val) => updateField('cta.description', val)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Texte du Bouton</Label>
            <Input value={getValue('cta.button')} onChange={(e) => updateField('cta.button', e.target.value)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
