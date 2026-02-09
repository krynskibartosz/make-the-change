'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormCheckbox, FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createProjectAction } from '@/app/[locale]/admin/(dashboard)/projects/actions'
import { LocalizedLink as Link } from '@/components/localized-link'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'
import type { ProjectFormData } from '@/lib/validators/project'
import {
  defaultProjectValues,
  projectFormSchema,
  projectStatusLabels,
  projectTypeLabels,
} from '@/lib/validators/project'

const NewProjectPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [projectImages, setProjectImages] = useState<string[]>([])

  const form = useForm<ProjectFormData>({
    defaultValues: defaultProjectValues,
    mode: 'onChange',
    resolver: zodResolver(projectFormSchema),
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      const payload = {
        ...value,
        images: projectImages,
      }

      const result = await createProjectAction(payload)

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'list'] })
        toast({
          variant: 'success',
          title: 'Projet créé',
          description: 'Le projet a été créé avec succès',
        })
        router.push('/admin/projects')
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: result.error || 'Impossible de créer le projet',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inattendue',
      })
    }
  })

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/projects"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau projet</h1>
      </div>

      {}
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Informations principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="name"
                  required
                  label="Nom du projet"
                  placeholder="Ruche en Provence Bio"
                />

                <FormInput
                  name="slug"
                  required
                  description="Utilisé dans l'URL du projet"
                  label="Slug (URL)"
                  placeholder="ruche-provence-bio"
                />

                <FormSelect
                  name="type"
                  label="Type de projet"
                  options={Object.entries(projectTypeLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />

                <FormInput
                  name="description"
                  label="Description courte"
                  placeholder="Projet de ruche collective en Provence"
                />

                <FormTextArea
                  name="long_description"
                  label="Description détaillée"
                  placeholder="Description complète du projet..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="target_budget"
                  required
                  label="Budget cible (€)"
                  min="1"
                  placeholder="5000"
                  type="number"
                />

                <FormInput name="producer_id" label="Producteur ID" placeholder="prod_habeebee" />

                <FormSelect
                  name="status"
                  label="Statut"
                  options={Object.entries(projectStatusLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                bucket="projects"
                currentImages={projectImages}
                entityId="temp-project" // Sera remplacé par l'ID réel après création
                maxFiles={8}
                onImagesChange={setProjectImages}
              />
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <FormCheckbox
                name="featured"
                falseBadge="Standard"
                label="Projet vedette"
                trueBadge="Vedette"
              />
            </CardContent>
          </Card>

          {}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>

            <Button
              className="flex items-center gap-2"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Créer le projet
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default NewProjectPage
