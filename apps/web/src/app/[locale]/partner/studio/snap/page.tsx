
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@make-the-change/core/ui'
import { Card } from '@make-the-change/core/ui'
import { Label } from '@make-the-change/core/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@make-the-change/core/ui'
import { Textarea } from '@make-the-change/core/ui'
import { Camera, X, Check, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { createProjectUpdate } from '../actions'
import { useToast } from '@/hooks/use-toast'

// Mock Projects (should be fetched from server)
const MY_PROJECTS = [
  { id: 'proj-1', name: 'Ruchers de la Vallée' },
  { id: 'proj-2', name: 'Verger Bio Pommes' },
]

const UPDATE_TYPES = [
  { value: 'production', label: 'Production', icon: '🚜' },
  { value: 'maintenance', label: 'Maintenance', icon: '🛠' },
  { value: 'harvest', label: 'Récolte', icon: '🍯' },
  { value: 'news', label: 'Nouvelle', icon: '📰' },
  { value: 'impact', label: 'Impact', icon: '🌱' },
]

export default function SnapUpdatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState<'camera' | 'details'>('camera')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [projectId, setProjectId] = useState(MY_PROJECTS[0]?.id || '')
  const [updateType, setUpdateType] = useState('news')
  const [content, setContent] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setStep('details')
    }
  }

  const handleRetake = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setStep('camera')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!content) {
      toast({ title: "Erreur", description: "Veuillez ajouter une description.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      if (selectedFile) formData.append('image', selectedFile)
      formData.append('content', content)
      formData.append('type', updateType)
      formData.append('projectId', projectId)
      const selectedType = UPDATE_TYPES.find(t => t.value === updateType)
      formData.append('title', `${selectedType?.icon} Update du ${new Date().toLocaleDateString()}`)

      await createProjectUpdate(formData)
      
      toast({ title: "Succès", description: "Update publiée avec succès !" })
      router.push('/partner/studio')
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Impossible de publier l'update.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'camera') {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Nouvelle Update</h1>
          <p className="text-muted-foreground">Partagez un moment avec vos investisseurs</p>
        </div>

        <Card 
          className="flex aspect-square w-full max-w-sm cursor-pointer flex-col items-center justify-center border-dashed bg-muted/30 hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="rounded-full bg-primary/10 p-6">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <span className="mt-4 font-medium text-primary">Prendre une photo</span>
          <span className="text-xs text-muted-foreground">(ou choisir depuis la galerie)</span>
        </Card>

        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="mt-8 w-full max-w-sm">
          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleRetake}>
          <X className="h-6 w-6" />
        </Button>
        <h1 className="font-bold">Détails</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Preview */}
      <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-black">
        {previewUrl ? (
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-2 right-2 opacity-90"
          onClick={handleRetake}
        >
          Changer
        </Button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Projet concerné</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un projet" />
            </SelectTrigger>
            <SelectContent>
              {MY_PROJECTS.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type d'update</Label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {UPDATE_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setUpdateType(type.value)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  updateType === type.value 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea 
            placeholder="Racontez ce qu'il se passe..." 
            className="min-h-[120px] resize-none text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <Button 
          className="w-full py-6 text-lg" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Publier l'Update
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
