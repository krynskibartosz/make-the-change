'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@make-the-change/core/ui'
import { ArrowLeft, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { Link } from '@/i18n/navigation'
import { type AuthState, forgotPassword } from '../actions'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(forgotPassword, {})

  if (state.success) {
    return (
      <Card className="border bg-background/70 shadow-2xl backdrop-blur-xl">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Email envoyé!</h2>
          <p className="mb-6 text-muted-foreground">{state.success}</p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back_to_login')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border bg-background/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl">{t('reset_password')}</CardTitle>
        <CardDescription className="hidden sm:block">
          Entrez votre email pour recevoir un lien de réinitialisation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label={t('email')}
            placeholder="votre@email.com"
            required
            autoComplete="email"
          />

          <Button type="submit" className="w-full" loading={isPending}>
            {t('reset_password_button')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          {t('back_to_login')}
        </Link>
      </CardFooter>
    </Card>
  )
}
