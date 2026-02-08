'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormInput, FormSelect } from '@make-the-change/core/ui/rhf'
import { Save, Shield, User } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'
import { useFormWithToast } from '@/hooks/use-form-with-toast'
import { countryOptions } from '@/lib/validators/user'

type UserEditData = {
  email: string
  first_name?: string
  last_name?: string
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur'
  kyc_status: 'pending' | 'light' | 'complete' | 'rejected'
  address_country_code?: string
}

type UserDetailsEditorProps = {
  userData: UserEditData & { id: string }
  isEditing: boolean
  isSaving?: boolean
  onSave?: (data: UserEditData) => Promise<void>
}

const UserCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full">{children}</div>
)

const userLevelOptions = [
  { value: 'explorateur', label: 'Explorateur' },
  { value: 'protecteur', label: 'Protecteur' },
  { value: 'ambassadeur', label: 'Ambassadeur' },
]

const kycStatusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'light', label: 'KYC léger' },
  { value: 'complete', label: 'KYC complet' },
  { value: 'rejected', label: 'Rejeté' },
]

const formattedCountryOptions = countryOptions.map((code) => ({
  value: code,
  label: code,
}))

export const UserDetailsEditor: FC<UserDetailsEditorProps> = ({
  userData,
  isEditing,
  isSaving = false,
  onSave,
}) => {
  const { form, handleSubmit, isSubmitting } = useFormWithToast({
    defaultValues: {
      email: userData.email || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      user_level: userData.user_level || 'explorateur',
      kyc_status: userData.kyc_status || 'pending',
      address_country_code: userData.address_country_code || 'FR',
    } as UserEditData,
    onSubmit: async (value: UserEditData) => {
      if (onSave) {
        await onSave(value)
        return { success: true }
      }
      return { success: true }
    },
    toasts: {
      success: {
        title: 'Utilisateur mis à jour',
        description: 'Les modifications ont été enregistrées avec succès',
      },
      error: {
        title: 'Erreur',
        description: "Impossible de mettre à jour l'utilisateur",
      },
    },
  })

  const contentSections = [
    {
      id: 'account',
      title: 'Informations du compte',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="first_name"
              disabled={!isEditing}
              label="Prénom"
              placeholder="Prénom"
            />
            <FormInput name="last_name" disabled={!isEditing} label="Nom" placeholder="Nom" />
          </div>

          <FormInput
            name="email"
            required
            disabled={!isEditing}
            label="Adresse e-mail"
            placeholder="email@example.com"
            type="email"
          />
        </div>
      ),
    },
    {
      id: 'permissions',
      title: 'Niveau et KYC',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <FormSelect
            name="user_level"
            disabled={!isEditing}
            label="Niveau utilisateur"
            options={userLevelOptions}
            placeholder="Sélectionner un niveau"
          />

          <FormSelect
            name="kyc_status"
            disabled={!isEditing}
            label="Statut KYC"
            options={kycStatusOptions}
            placeholder="Sélectionner un statut"
          />

          <FormSelect
            name="address_country_code"
            disabled={!isEditing}
            label="Code pays"
            options={formattedCountryOptions}
            placeholder="Sélectionner un code pays"
          />
        </div>
      ),
    },
  ]

  return (
    <FormProvider {...form}>
      <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
        <UserCardsGrid>
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
        </UserCardsGrid>

        {}
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
