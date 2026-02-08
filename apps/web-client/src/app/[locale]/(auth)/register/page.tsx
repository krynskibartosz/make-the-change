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
import { Check, ExternalLink, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FormEvent, useActionState, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { type AuthState, register } from '../actions'

// Map email domains to their webmail URLs
const emailProviders: Record<string, { name: string; url: string; icon?: string }> = {
  'gmail.com': { name: 'Gmail', url: 'https://mail.google.com' },
  'googlemail.com': { name: 'Gmail', url: 'https://mail.google.com' },
  'outlook.com': { name: 'Outlook', url: 'https://outlook.live.com' },
  'hotmail.com': { name: 'Outlook', url: 'https://outlook.live.com' },
  'live.com': { name: 'Outlook', url: 'https://outlook.live.com' },
  'msn.com': { name: 'Outlook', url: 'https://outlook.live.com' },
  'yahoo.com': { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' },
  'yahoo.fr': { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' },
  'icloud.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' },
  'me.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' },
  'protonmail.com': { name: 'ProtonMail', url: 'https://mail.protonmail.com' },
  'proton.me': { name: 'Proton Mail', url: 'https://mail.proton.me' },
}

function getEmailProvider(email: string) {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return null
  return emailProviders[domain] || null
}

export default function RegisterPage() {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(register, {})
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [step, setStep] = useState(1)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const totalSteps = 3

  const canProceed = useMemo(() => {
    if (step === 1) {
      return Boolean(formValues.firstName && formValues.lastName)
    }
    if (step === 2) {
      return Boolean(
        formValues.email &&
          formValues.password &&
          formValues.confirmPassword &&
          formValues.password === formValues.confirmPassword,
      )
    }
    return formValues.terms
  }, [formValues, step])

  const showPasswordMismatch =
    step === 2 &&
    formValues.confirmPassword.length > 0 &&
    formValues.password !== formValues.confirmPassword

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < totalSteps) {
      event.preventDefault()
      if (canProceed) {
        setStep((prev) => Math.min(prev + 1, totalSteps))
      }
      return
    }

    const formData = new FormData(event.currentTarget)
    setSubmittedEmail(String(formData.get('email') || ''))
  }

  if (state.success) {
    const provider = getEmailProvider(submittedEmail)

    return (
      <Card className="border bg-background/70 shadow-2xl backdrop-blur-xl">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Inscription réussie !</h2>
          <p className="mb-2 text-muted-foreground">Un email de confirmation a été envoyé à</p>
          <p className="mb-4 font-medium text-foreground">{submittedEmail}</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Cliquez sur le lien dans l'email pour activer votre compte.
          </p>

          <div className="space-y-3">
            {provider ? (
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Ouvrir {provider.name}
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:" target="_blank" rel="noopener noreferrer">
                  <Mail className="mr-2 h-4 w-4" />
                  Ouvrir ma boîte mail
                </a>
              </Button>
            )}

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full">
                {t('back_to_login')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border bg-background/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl">{t('register')}</CardTitle>
        <CardDescription className="hidden sm:block">
          Créez votre compte pour commencer à investir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} onSubmit={handleFormSubmit} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex items-center justify-between rounded-full border bg-background/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>
              Etape {step}/{totalSteps}
            </span>
            <span>{step === 1 ? 'Profil' : step === 2 ? 'Sécurité' : 'Validation'}</span>
          </div>

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label={t('first_name')}
                placeholder="Jean"
                required
                autoComplete="given-name"
                value={formValues.firstName}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, firstName: event.target.value }))
                }
              />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label={t('last_name')}
                placeholder="Dupont"
                required
                autoComplete="family-name"
                value={formValues.lastName}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, lastName: event.target.value }))
                }
              />
            </div>
          )}

          {step !== 1 && (
            <>
              <input type="hidden" name="firstName" value={formValues.firstName} />
              <input type="hidden" name="lastName" value={formValues.lastName} />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                id="email"
                name="email"
                type="email"
                label={t('email')}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, email: event.target.value }))
                }
              />

              <Input
                id="password"
                name="password"
                type="password"
                label={t('password')}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, password: event.target.value }))
                }
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label={t('confirm_password')}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={formValues.confirmPassword}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
                error={showPasswordMismatch ? 'Les mots de passe ne correspondent pas.' : undefined}
              />
            </>
          )}

          {step === 3 && (
            <>
              <input type="hidden" name="email" value={formValues.email} />
              <input type="hidden" name="password" value={formValues.password} />
              <input type="hidden" name="confirmPassword" value={formValues.confirmPassword} />
            </>
          )}

          {step === 3 && (
            <div className="flex items-start gap-2 rounded-2xl border bg-muted/30 p-4">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1 h-4 w-4 rounded border-input"
                checked={formValues.terms}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, terms: event.target.checked }))
                }
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t('accept_terms')}{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  conditions
                </Link>
              </label>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
              >
                Retour
              </Button>
            )}
            <Button
              type={step === totalSteps ? 'submit' : 'button'}
              className="w-full"
              onClick={() => {
                if (step < totalSteps && canProceed) {
                  setStep((prev) => Math.min(prev + 1, totalSteps))
                }
              }}
              disabled={!canProceed || isPending}
              loading={step === totalSteps && isPending}
            >
              {step === totalSteps ? t('register_button') : 'Continuer'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t('already_have_account')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('login')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
