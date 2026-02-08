'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormInput, FormSelect, FormTextArea } from '@make-the-change/core/ui/rhf'
import { Building2, Mail, Save } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'
import { useFormWithToast } from '@/hooks/use-form-with-toast'
import { type PartnerFormData, partnerStatusLabels } from '@/lib/validators/partner'

type PartnerDetailsEditorProps = {
  partnerData: PartnerFormData & { id: string }
  isEditing: boolean
  isSaving?: boolean
  onSave?: (data: PartnerFormData) => Promise<void>
}

const PartnerCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full">{children}</div>
)

const statusOptions = Object.entries(partnerStatusLabels).map(([value, label]) => ({
  value,
  label,
}))

export const PartnerDetailsEditor: FC<PartnerDetailsEditorProps> = ({
  partnerData,
  isEditing,
  isSaving = false,
  onSave,
}) => {
  const { form, handleSubmit, isSubmitting } = useFormWithToast({
    defaultValues: partnerData,
    onSubmit: async (value: PartnerFormData) => {
      if (onSave) {
        await onSave(value)
        return { success: true }
      }
      return { success: true }
    },
    toasts: {
      success: {
        title: 'Partenaire mis à jour',
        description: 'Les modifications ont été enregistrées avec succès',
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le partenaire',
      },
    },
  })

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <FormInput
            name="name"
            required
            disabled={!isEditing}
            label="Nom du partenaire"
            placeholder="Nom du partenaire"
          />

          <FormInput
            name="slug"
            required
            disabled={!isEditing}
            label="Slug"
            placeholder="slug-du-partenaire"
          />

          <FormTextArea
            name="description"
            disabled={!isEditing}
            label="Description"
            placeholder="Description du partenaire..."
            rows={6}
          />
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact & Statut',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <FormInput
            name="contact_email"
            required
            disabled={!isEditing}
            label="Email de contact"
            placeholder="contact@partenaire.com"
            type="email"
          />

          <FormInput
            name="contact_website"
            disabled={!isEditing}
            label="Site web"
            placeholder="https://partenaire.com"
            type="url"
          />

          <FormSelect
            name="status"
            disabled={!isEditing}
            label="Statut"
            options={statusOptions}
            placeholder="Sélectionner un statut"
          />
        </div>
      ),
    },
  ]

  return (
    <FormProvider {...form}>
      <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
        <PartnerCardsGrid>
          {contentSections.map((section) => (
            <Card key={section.id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </PartnerCardsGrid>

        {isEditing && (
          <div className="flex justify-end">
            <Button
              className="flex items-center gap-2"
              disabled={isSubmitting || isSaving}
              type="submit"
            >
              {isSubmitting || isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
