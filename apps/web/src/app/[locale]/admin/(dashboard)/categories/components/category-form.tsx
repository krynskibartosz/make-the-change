'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormCheckbox, FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { FolderTree, Save, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/i18n/navigation'
import {
  type CategoryFormData,
  categoryFormSchema,
} from '@/lib/validators/category'
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '../actions'

type CategoryFormProps = {
  initialData?: CategoryFormData & { id: string }
  parents?: Array<{ id: string; name: string }>
}

export const CategoryForm: FC<CategoryFormProps> = ({ initialData, parents = [] }) => {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = !!initialData

  const form = useForm<CategoryFormData>({
    defaultValues: initialData || {
      name_i18n: { fr: '', en: '' },
      description_i18n: { fr: '', en: '' },
      slug: '',
      is_active: true,
      sort_order: 0,
      metadata: {},
      parent_id: null,
    },
    mode: 'onChange',
    resolver: zodResolver(categoryFormSchema),
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      const result = isEditMode
        ? await updateCategoryAction(initialData.id, value)
        : await createCategoryAction(value)

      if (!result.success) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      toast({
        variant: 'success',
        title: isEditMode ? 'Catégorie mise à jour' : 'Catégorie créée',
        description: isEditMode
          ? 'La catégorie a été mise à jour avec succès'
          : 'La catégorie a été créée avec succès',
      })

      if (!isEditMode && result.data?.id) {
        router.push(`/admin/categories/${result.data.id}`)
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
    if (!isEditMode || !confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return

    try {
        const result = await deleteCategoryAction(initialData.id)
        if (!result.success) {
            throw new Error(result.error || 'Impossible de supprimer la catégorie')
        }
        toast({
            variant: 'success',
            title: 'Catégorie supprimée',
            description: 'La catégorie a été supprimée avec succès',
        })
        router.push('/admin/categories')
    } catch (error: unknown) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: error instanceof Error ? error.message : 'Impossible de supprimer la catégorie',
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
                <FolderTree className="h-4 w-4" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                    name="name_i18n.fr"
                    required
                    label="Nom (FR)"
                    placeholder="Miel"
                />
                <FormInput
                    name="name_i18n.en"
                    required
                    label="Nom (EN)"
                    placeholder="Honey"
                />
              </div>

              <FormInput
                name="slug"
                required
                description="Identifiant unique pour l'URL (ex: miel)"
                label="Slug"
                placeholder="miel"
              />

              <div className="grid grid-cols-2 gap-4">
                 <FormTextArea
                    name="description_i18n.fr"
                    label="Description (FR)"
                    placeholder="Description..."
                    rows={3}
                 />
                 <FormTextArea
                    name="description_i18n.en"
                    label="Description (EN)"
                    placeholder="Description..."
                    rows={3}
                 />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelect
                name="parent_id"
                label="Catégorie parente"
                options={[{ value: '', label: 'Aucune (Racine)' }, ...parents.map((p) => ({ value: p.id, label: p.name }))]}
                placeholder="Sélectionner une catégorie parente"
              />

              <FormInput
                name="sort_order"
                label="Ordre d'affichage"
                type="number"
                min="0"
              />

              <div className="pt-4">
                <FormCheckbox
                    name="is_active"
                    label="Catégorie active"
                    description="Visible sur le site public"
                    trueBadge="Active"
                    falseBadge="Inactive"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle>SEO</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <FormInput
                    name="seo_title"
                    label="Titre SEO"
                    placeholder="Miel artisanal | Make The Change"
                />
                <FormTextArea
                    name="seo_description"
                    label="Description SEO"
                    placeholder="Découvrez notre sélection de miels..."
                    rows={3}
                />
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
