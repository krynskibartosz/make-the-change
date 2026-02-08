'use client'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FormInput, FormSelect } from '@make-the-change/core/ui/rhf'
import { ArrowLeft, Plus, Shield, User } from 'lucide-react'
import type { FC } from 'react'
import { FormProvider } from 'react-hook-form'
import { createUserAction } from '@/app/[locale]/admin/(dashboard)/users/actions'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useFormWithToast } from '@/hooks/use-form-with-toast'
import { useRouter } from '@/i18n/navigation'
import {
  countryOptions,
  defaultUserValues,
  kycStatusLabels,
  type UserFormData,
  userLevelLabels,
} from '@/lib/validators/user'

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

const formattedCountryOptions = countryOptions.map((country) => ({
  value: country,
  label: country,
}))

const NewUserPage: FC = () => {
  const router = useRouter()
  const { form, handleSubmit, isSubmitting } = useFormWithToast({
    defaultValues: defaultUserValues,
    onSubmit: async (value: UserFormData) => {
      const result = await createUserAction({
        ...value,
        email: value.email.toLowerCase().trim(),
      })

      if (!result.success || !result.id) {
        throw new Error(result.message || 'Création utilisateur échouée')
      }

      router.push(`/admin/users/${result.id}`)
    },
    toasts: {
      success: {
        title: 'Utilisateur créé',
        description: "L'utilisateur a été créé avec succès",
      },
      error: {
        title: 'Erreur',
        description: "Impossible de créer l'utilisateur",
      },
    },
  })

  const userLevelValue = form.watch('user_level')
  const kycStatusValue = form.watch('kyc_status')

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/users"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux utilisateurs
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouvel utilisateur</h1>
      </div>

      {}
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Informations de connexion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="email"
                  required
                  label="Email"
                  placeholder="utilisateur@example.com"
                  type="email"
                />

                <FormInput
                  name="password"
                  required
                  label="Mot de passe"
                  placeholder="Mot de passe sécurisé"
                  type="password"
                />

                <FormInput
                  name="confirmPassword"
                  required
                  label="Confirmer le mot de passe"
                  placeholder="Répéter le mot de passe"
                  type="password"
                />
              </CardContent>
            </Card>

            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput name="first_name" label="Prénom" placeholder="Jean" />

                <FormInput name="last_name" label="Nom" placeholder="Dupont" />

                <FormSelect
                  name="address_country_code"
                  label="Pays"
                  options={formattedCountryOptions}
                  placeholder="Sélectionner un code pays"
                />
              </CardContent>
            </Card>
          </div>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Configuration du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormSelect
                    name="user_level"
                    label="Niveau utilisateur"
                    options={userLevelOptions}
                    placeholder="Sélectionner un niveau"
                  />
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {userLevelLabels[userLevelValue as keyof typeof userLevelLabels]}
                    </Badge>
                  </div>
                </div>

                <div>
                  <FormSelect
                    name="kyc_status"
                    label="Statut KYC"
                    options={kycStatusOptions}
                    placeholder="Sélectionner un statut"
                  />
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {kycStatusLabels[kycStatusValue as keyof typeof kycStatusLabels]}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
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
                  <Plus className="h-4 w-4" />
                  Créer l&apos;utilisateur
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
export default NewUserPage
