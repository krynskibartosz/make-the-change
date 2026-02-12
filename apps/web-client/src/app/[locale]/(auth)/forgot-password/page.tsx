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
import { ArrowLeft, ArrowRight, Mail, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { Link } from '@/i18n/navigation'
import { type AuthState, forgotPassword } from '../actions'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(forgotPassword, {})

  if (state.success) {
    return (
      <Card className="border bg-background/60 shadow-2xl backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10 text-center space-y-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 border border-primary/20">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">{t('forgot_success_title')}</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">{state.success}</p>
          </div>

          <div className="p-6 rounded-2xl bg-muted/30 text-sm font-medium text-muted-foreground leading-relaxed">
            {t('forgot_success_hint')}
          </div>

          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm border-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back_to_login')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border bg-background/60 shadow-2xl backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 text-center space-y-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight">{t('reset_password')}</CardTitle>
        <CardDescription className="text-sm font-medium">{t('forgot_help_text')}</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <Form action={formAction} className="space-y-6">
          {state.error && (
            <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive font-bold border border-destructive/20 animate-in zoom-in-95">
              {state.error}
            </div>
          )}

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

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
            loading={isPending}
          >
            {t('reset_password_button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="p-8 pt-0 flex justify-center border-t border-border/50 bg-muted/20">
        <Link
          href="/login"
          className="text-xs font-bold text-primary hover:underline uppercase tracking-widest mt-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-3 w-3" />
          {t('back_to_login')}
        </Link>
      </CardFooter>
    </Card>
  )
}
