'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Form,
  Input,
} from '@make-the-change/core/ui'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { type AuthState, login } from '@/app/[locale]/(auth)/actions'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type LoginFormProps = {
  modal?: boolean
}

export function LoginForm({ modal = false }: LoginFormProps) {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, {})
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || ''
  const registerHref = returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : '/register'

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
        <Form action={formAction} className="space-y-6">
          <input type="hidden" name="returnTo" value={returnTo} />
          {state.error && (
            <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive font-bold border border-destructive/20 animate-in zoom-in-95">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <Field className="relative group">
              <Mail className="absolute left-4 top-[38px] h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                name="email"
                type="email"
                label={t('email')}
                placeholder={t('email_placeholder')}
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                required
                autoComplete="email"
              />
            </Field>

            <Field className="relative group">
              <Lock className="absolute left-4 top-[38px] h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                name="password"
                type="password"
                label={t('password')}
                placeholder="••••••••"
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                required
                autoComplete="current-password"
              />
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

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
            loading={isPending}
          >
            {t('login_button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
