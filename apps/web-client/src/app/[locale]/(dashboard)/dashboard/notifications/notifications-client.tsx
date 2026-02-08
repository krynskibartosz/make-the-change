'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxWithLabel,
} from '@make-the-change/core/ui'
import { Check } from 'lucide-react'
import { useActionState } from 'react'
import { type NotificationState, updateNotifications } from './actions'

type NotificationsClientProps = {
  initial: {
    project_updates: boolean
    product_updates: boolean
    leaderboard: boolean
    marketing: boolean
  }
}

export function NotificationsClient({ initial }: NotificationsClientProps) {
  const [state, formAction, isPending] = useActionState<NotificationState, FormData>(
    updateNotifications,
    {},
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
        <p className="hidden text-muted-foreground sm:block">Choisissez ce que vous recevez</p>
      </div>

      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Préférences</CardTitle>
          <CardDescription className="hidden sm:block">Simple, clair, utile</CardDescription>
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

            <CheckboxWithLabel
              name="project_updates"
              defaultChecked={initial.project_updates}
              label="Updates projets"
              description="Nouvelles photos, milestones et nouvelles étapes."
            />
            <CheckboxWithLabel
              name="product_updates"
              defaultChecked={initial.product_updates}
              label="Actus boutique"
              description="Nouveautés produits et réassorts."
            />
            <CheckboxWithLabel
              name="leaderboard"
              defaultChecked={initial.leaderboard}
              label="Classement"
              description="Votre progression et évolutions de rang."
            />
            <CheckboxWithLabel
              name="marketing"
              defaultChecked={initial.marketing}
              label="News"
              description="Conseils et annonces (optionnel)."
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
