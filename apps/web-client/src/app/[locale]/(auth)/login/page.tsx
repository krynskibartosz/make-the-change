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
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { Link } from '@/i18n/navigation'
import { type AuthState, login } from '../actions'

export default function LoginPage() {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, {})
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || ''

  return (
    <Card className="border bg-background/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl">{t('login')}</CardTitle>
        <CardDescription className="hidden sm:block">
          Connectez-vous pour accéder à votre espace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="returnTo" value={returnTo} />
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

          <Input
            id="password"
            name="password"
            type="password"
            label={t('password')}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t('forgot_password')}
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={isPending}>
            {t('login_button')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t('no_account')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('register')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
