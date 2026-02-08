'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormCheckbox, FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { Leaf, Save, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'
import {
  type SpeciesAdminFormData,
  speciesAdminFormSchema,
} from '@/lib/validators/species'
import { createSpeciesAction, updateSpeciesAction, deleteSpeciesAction } from '../actions'

type SpeciesFormProps = {
  initialData?: SpeciesAdminFormData & { id: string }
}

const conservationStatusOptions = [
    { value: 'least_concern', label: 'Préoccupation mineure' },
    { value: 'near_threatened', label: 'Quasi menacé' },
    { value: 'vulnerable', label: 'Vulnérable' },
    { value: 'endangered', label: 'En danger' },
    { value: 'critically_endangered', label: 'En danger critique' },
    { value: 'extinct_in_the_wild', label: 'Éteint à l\'état sauvage' },
    { value: 'extinct', label: 'Éteint' },
]

export const SpeciesForm: FC<SpeciesFormProps> = ({ initialData }) => {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = !!initialData

  const form = useForm<SpeciesAdminFormData>({
    defaultValues: initialData || {
      name_i18n: { fr: '', en: '' },
      scientific_name: '',
      description_i18n: { fr: '', en: '' },
      habitat_i18n: { fr: '', en: '' },
      is_featured: false,
      is_endemic: false,
      content_levels: {
        beginner: { title: '', description: '', unlocked_at_level: 0 },
        intermediate: { title: '', description: '', unlocked_at_level: 5 },
        advanced: { title: '', description: '', unlocked_at_level: 10 },
      }
    },
    mode: 'onChange',
    resolver: zodResolver(speciesAdminFormSchema),
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      const result = isEditMode
        ? await updateSpeciesAction(initialData.id, value)
        : await createSpeciesAction(value)

      if (!result.success) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      toast({
        variant: 'success',
        title: isEditMode ? 'Espèce mise à jour' : 'Espèce créée',
        description: isEditMode
          ? 'L\'espèce a été mise à jour avec succès'
          : 'L\'espèce a été créée avec succès',
      })

      if (!isEditMode && result.data?.id) {
        router.push(`/admin/biodex/${result.data.id}`)
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      })
    }
  })

  const handleDelete = async () => {
    if (!isEditMode || !confirm('Êtes-vous sûr de vouloir supprimer cette espèce ?')) return

    try {
        const result = await deleteSpeciesAction(initialData.id)
        if (!result.success) {
            throw new Error(result.error || 'Impossible de supprimer l\'espèce')
        }
        toast({
            variant: 'success',
            title: 'Espèce supprimée',
            description: 'L\'espèce a été supprimée avec succès',
        })
        router.push('/admin/biodex')
    } catch (error: unknown) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: error instanceof Error ? error.message : 'Impossible de supprimer l\'espèce',
        })
    }
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                    name="name_i18n.fr"
                    required
                    label="Nom (FR)"
                    placeholder="Abeille noire"
                />
                <FormInput
                    name="name_i18n.en"
                    required
                    label="Nom (EN)"
                    placeholder="Black Bee"
                />
              </div>

              <FormInput
                name="scientific_name"
                label="Nom scientifique"
                placeholder="Apis mellifera mellifera"
                className="italic"
              />

              <FormSelect
                name="conservation_status"
                label="Statut de conservation"
                options={conservationStatusOptions}
                placeholder="Sélectionner un statut"
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                 <FormCheckbox
                    name="is_featured"
                    label="Mettre en avant"
                    trueBadge="Oui"
                    falseBadge="Non"
                 />
                 <FormCheckbox
                    name="is_endemic"
                    label="Espèce endémique"
                    trueBadge="Oui"
                    falseBadge="Non"
                 />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descriptions & Habitat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <FormTextArea
                    name="description_i18n.fr"
                    label="Description (FR)"
                    rows={3}
                 />
                 <FormTextArea
                    name="description_i18n.en"
                    label="Description (EN)"
                    rows={3}
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormTextArea
                    name="habitat_i18n.fr"
                    label="Habitat (FR)"
                    rows={3}
                 />
                 <FormTextArea
                    name="habitat_i18n.en"
                    label="Habitat (EN)"
                    rows={3}
                 />
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle>Niveaux de Contenu (Gamification)</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Beginner */}
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Niveau Débutant (Lvl 0)</h4>
                        <FormInput name="content_levels.beginner.title" label="Titre" />
                        <FormTextArea name="content_levels.beginner.description" label="Contenu" rows={4} />
                    </div>

                    {/* Intermediate */}
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Niveau Intermédiaire (Lvl 5)</h4>
                        <FormInput name="content_levels.intermediate.title" label="Titre" />
                        <FormTextArea name="content_levels.intermediate.description" label="Contenu" rows={4} />
                    </div>

                    {/* Advanced */}
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Niveau Expert (Lvl 10)</h4>
                        <FormInput name="content_levels.advanced.title" label="Titre" />
                        <FormTextArea name="content_levels.advanced.description" label="Contenu" rows={4} />
                    </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          {isEditMode && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
            </Button>
          )}
          
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
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
