'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxWithLabel,
  Input,
} from '@make-the-change/core/ui'
import { Check } from 'lucide-react'
import { useActionState } from 'react'
import { ThemeSelection } from '@/components/theme/theme-selection'
import { type SettingsState, updateSettings } from './actions'

type SettingsClientProps = {
  initial: {
    languageCode: string
    timezone: string
    publicProfile: boolean
    marketingConsent: boolean
  }
}

export function SettingsClient({ initial }: SettingsClientProps) {
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateSettings, {})

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Paramètres</h1>
        <p className="hidden text-muted-foreground sm:block">Personnalisez votre expérience</p>
      </div>

      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Apparence</CardTitle>
          <CardDescription className="hidden sm:block">Personnalisez le thème et les couleurs de l'interface</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
          <ThemeSelection />
        </CardContent>
      </Card>

      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Préférences</CardTitle>
          <CardDescription className="hidden sm:block">
            Langue, timezone, profil public
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
          <form action={formAction} className="space-y-4">
            {state.error ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            ) : null}
            {state.success ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-100 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                {state.success}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="languageCode"
                label="Langue"
                defaultValue={initial.languageCode}
                placeholder="fr"
              />
              <Input
                name="timezone"
                label="Timezone"
                defaultValue={initial.timezone}
                placeholder="Europe/Paris"
              />
            </div>

            <CheckboxWithLabel
              name="publicProfile"
              defaultChecked={initial.publicProfile}
              label="Profil public"
              description="Permet d'apparaître dans le classement et d'avoir un profil public."
            />

            <CheckboxWithLabel
              name="marketingConsent"
              defaultChecked={initial.marketingConsent}
              label="Communications marketing"
              description="Recevoir des nouvelles de la plateforme et des projets."
            />

            <Button type="submit" loading={isPending} className="w-full sm:w-auto">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
