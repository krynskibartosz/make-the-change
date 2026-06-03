'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
  PasswordInput,
  PasswordInputField,
  PasswordVisibilityToggle,
} from '@make-the-change/core/ui'
import { Lock, Mail } from 'lucide-react'
import { AuthSubmitButton } from '@/app/[locale]/(auth)/_components/auth-submit-button'
import { FormErrorAlert } from '@/app/[locale]/(auth)/_components/form-error-alert'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'
import { type AuthState, login } from '@/app/[locale]/(auth)/actions'
import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type LoginFormProps = {
  modal?: boolean
}

export function LoginForm({ modal = false }: LoginFormProps) {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, {})
  const searchParams = useSearchParams()
  const router = useRouter()
  const returnTo = searchParams.get('returnTo') || ''
  const registerHref = returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : '/register'

  useEffect(() => {
    const redirectUrl = state.redirectUrl

    if (!state.success || !redirectUrl) {
      return
    }

    router.replace(redirectUrl)
    router.refresh()
  }, [router, state])

  return (
    <Card
      className={cn(
        'mx-auto w-full overflow-hidden',
        modal
          ? 'flex h-full min-h-0 flex-col max-w-none rounded-none border-0 bg-background/95 shadow-none backdrop-blur-none sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-md sm:rounded-[2.5rem] sm:border sm:bg-background/60 sm:shadow-2xl sm:backdrop-blur-xl'
          : 'max-w-md rounded-[2.5rem] border bg-background/60 shadow-2xl backdrop-blur-xl',
      )}
    >
      <CardHeader className="p-8 pb-4 text-center space-y-2">
        <CardTitle className="text-3xl font-black tracking-tight">{t('login')}</CardTitle>
        <CardDescription className="text-sm font-medium">{t('login_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          modal ? 'min-h-0 flex-1 overflow-y-auto p-6 pt-4 sm:p-8 sm:pt-4' : 'p-8 pt-4',
        )}
      >
        <Form action={formAction} errors={state.errors} className="space-y-6">
          <input type="hidden" name="returnTo" value={returnTo} />
          <FormErrorAlert error={state.formError ?? state.error} />

          <div className="space-y-4">
            <Field name="email" className="relative group">
              <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
                {t('email')}
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                <FieldControl
                  render={
                    <Input
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                    />
                  }
                  type="email"
                  required
                  placeholder={t('email_placeholder')}
                  autoComplete="email"
                />
              </div>
              <FieldError className="mt-1.5 text-sm text-destructive" />
            </Field>

            <Field name="password" className="relative group">
              <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
                {t('password')}
              </FieldLabel>
              <PasswordInputField>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                <FieldControl
                  render={
                    <PasswordInput
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                    />
                  }
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <PasswordVisibilityToggle />
              </PasswordInputField>
              <FieldError className="mt-1.5 text-sm text-destructive" />
            </Field>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
            >
              {t('forgot_password')}
            </Link>
          </div>

          <AuthSubmitButton loading={isPending}>{t('login_button')}</AuthSubmitButton>
        </Form>
      </CardContent>
      <CardFooter
        className={cn(
          'flex justify-center border-t border-border/50 bg-muted/20',
          modal ? 'shrink-0 p-6 pt-0 sm:p-8 sm:pt-0' : 'p-8 pt-0',
        )}
      >
        <p className="text-sm font-medium text-muted-foreground mt-6">
          {t('no_account')}{' '}
          <Link
            href={registerHref}
            className="text-primary font-black hover:underline uppercase tracking-tight"
          >
            {t('register')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
