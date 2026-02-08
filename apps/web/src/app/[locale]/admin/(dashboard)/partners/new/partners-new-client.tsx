'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Building2, Save } from 'lucide-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useFormWithToast } from '@/hooks/use-form-with-toast'
import { useRouter } from '@/i18n/navigation'
import { adminPartnersApi } from '@/lib/api/admin'
import { generateSlug } from '@/lib/form-utils'
import {
  defaultPartnerValues,
  type PartnerFormData,
  partnerFormSchema,
  partnerStatusLabels,
} from '@/lib/validators/partner'

const statusOptions = Object.entries(partnerStatusLabels).map(([value, label]) => ({
  value,
  label,
}))

const NewPartnerPage: FC = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createPartner = useMutation({
    mutationFn: (data: PartnerFormData) => adminPartnersApi.create(data),
    onSuccess: (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'list'] })
      router.push(`/admin/partners/${data.id}`)
    },
  })

  const { form, handleSubmit, isSubmitting } = useFormWithToast({
    defaultValues: defaultPartnerValues,
    schema: partnerFormSchema,
    onSubmit: async (value: PartnerFormData) => {
      await createPartner.mutateAsync(value)
      return { success: true }
    },
    toasts: {
      success: {
        title: 'Partenaire créé',
        description: 'Le nouveau partenaire a été ajouté avec succès.',
      },
      error: { title: 'Erreur de création', description: 'Impossible de créer le partenaire.' },
    },
  })

  const nameValue = form.watch('name')
  const slugDirty = Boolean(form.formState.dirtyFields.slug)

  useEffect(() => {
    if (nameValue && !slugDirty) {
      form.setValue('slug', generateSlug(nameValue), { shouldDirty: false })
    }
  }, [form, nameValue, slugDirty])

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/partners"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux partenaires
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau partenaire</h1>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations principales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInput
                    name="name"
                    required
                    label="Nom du partenaire"
                    placeholder="Ex: Les Ruchers du Vexin"
                  />
                  <FormInput
                    name="slug"
                    required
                    label="Slug"
                    placeholder="ex-les-ruchers-du-vexin"
                  />
                  <FormTextArea
                    name="description"
                    label="Description"
                    placeholder="Description du partenaire..."
                    rows={5}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Statut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInput
                    name="contact_email"
                    required
                    label="Email de contact"
                    placeholder="contact@partenaire.com"
                    type="email"
                  />
                  <FormInput
                    name="contact_website"
                    label="Site web"
                    placeholder="https://partenaire.com"
                    type="url"
                  />
                  <FormSelect name="status" label="Statut" options={statusOptions} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              disabled={isSubmitting}
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button className="flex items-center gap-2" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Créer le partenaire
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default NewPartnerPage
