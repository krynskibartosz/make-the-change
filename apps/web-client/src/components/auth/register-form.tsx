'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  Input,
} from '@make-the-change/core/ui'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  FileCheck,
  Lock,
  Mail,
  Shield,
  User,
  UserCircle,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  type FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type AuthState, register } from '@/app/[locale]/(auth)/actions'
import { Link } from '@/i18n/navigation'
import { isRecord } from '@/lib/type-guards'
import { cn } from '@/lib/utils'

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

const REGISTER_WIZARD_STORAGE_KEY = 'register_wizard'
const WIZARD_MIN_STEP = 1
const WIZARD_MAX_STEP = 3

type RegisterWizardDraft = {
  firstName: string
  lastName: string
  email: string
  terms: boolean
  step: number
}

const clampWizardStep = (value: number) =>
  Math.min(WIZARD_MAX_STEP, Math.max(WIZARD_MIN_STEP, value))

const parseWizardStep = (value: string | null): number | null => {
  if (value === null) return null

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return null

  return clampWizardStep(parsed)
}

const isString = (value: unknown): value is string => typeof value === 'string'

const parseRegisterWizardDraft = (value: string): Partial<RegisterWizardDraft> | null => {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!isRecord(parsed)) {
      return null
    }

    return {
      firstName: isString(parsed.firstName) ? parsed.firstName : undefined,
      lastName: isString(parsed.lastName) ? parsed.lastName : undefined,
      email: isString(parsed.email) ? parsed.email : undefined,
      terms: typeof parsed.terms === 'boolean' ? parsed.terms : undefined,
      step: typeof parsed.step === 'number' ? parsed.step : undefined,
    }
  } catch {
    return null
  }
}

type RegisterFormProps = {
  modal?: boolean
}

export function RegisterForm({ modal = false }: RegisterFormProps) {
  const t = useTranslations('auth')
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(register, {})
  const searchParams = useSearchParams()
  const urlStep = useMemo(() => parseWizardStep(searchParams.get('step')), [searchParams])
  const returnTo = searchParams.get('returnTo') || ''
  const loginHref = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login'
  const hasInitializedWizard = useRef(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [step, setStep] = useState(urlStep ?? WIZARD_MIN_STEP)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const totalSteps = WIZARD_MAX_STEP

  const syncStepInHistory = useCallback(
    (nextStep: number, mode: 'push' | 'replace' = 'replace') => {
      if (typeof window === 'undefined') return

      const normalizedStep = clampWizardStep(nextStep)
      const params = new URLSearchParams(window.location.search)
      if (params.get('step') === String(normalizedStep)) {
        return
      }

      params.set('step', String(normalizedStep))
      const query = params.toString()
      const href = query ? `${window.location.pathname}?${query}` : window.location.pathname
      if (mode === 'push') {
        window.history.pushState(window.history.state, '', href)
        return
      }

      window.history.replaceState(window.history.state, '', href)
    },
    [],
  )

  const goToStep = useCallback(
    (nextStep: number) => {
      const normalizedStep = clampWizardStep(nextStep)
      setStep(normalizedStep)
      syncStepInHistory(normalizedStep, 'push')
    },
    [syncStepInHistory],
  )

  useEffect(() => {
    if (hasInitializedWizard.current) return
    hasInitializedWizard.current = true

    let restoredStep = urlStep ?? WIZARD_MIN_STEP

    try {
      const rawDraft = window.sessionStorage.getItem(REGISTER_WIZARD_STORAGE_KEY)
      if (rawDraft) {
        const parsedDraft = parseRegisterWizardDraft(rawDraft)
        if (parsedDraft) {
          setFormValues((prev) => ({
            ...prev,
            firstName: isString(parsedDraft.firstName) ? parsedDraft.firstName : prev.firstName,
            lastName: isString(parsedDraft.lastName) ? parsedDraft.lastName : prev.lastName,
            email: isString(parsedDraft.email) ? parsedDraft.email : prev.email,
            terms: typeof parsedDraft.terms === 'boolean' ? parsedDraft.terms : prev.terms,
          }))

          if (urlStep === null && typeof parsedDraft.step === 'number') {
            restoredStep = clampWizardStep(parsedDraft.step)
          }
        }
      }
    } catch {
      // Ignore malformed drafts in session storage.
    }

    setStep(restoredStep)
    if (urlStep !== restoredStep) {
      syncStepInHistory(restoredStep, 'replace')
    }
  }, [syncStepInHistory, urlStep])

  useEffect(() => {
    if (urlStep === null) return

    setStep((currentStep) => (currentStep === urlStep ? currentStep : urlStep))
  }, [urlStep])

  useEffect(() => {
    const handlePopState = () => {
      const nextStep = parseWizardStep(new URLSearchParams(window.location.search).get('step'))
      setStep(nextStep ?? WIZARD_MIN_STEP)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!hasInitializedWizard.current) return

    const draft: RegisterWizardDraft = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      terms: formValues.terms,
      step,
    }

    try {
      window.sessionStorage.setItem(REGISTER_WIZARD_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Ignore storage quota / access errors.
    }
  }, [formValues.email, formValues.firstName, formValues.lastName, formValues.terms, step])

  useEffect(() => {
    if (!state.success) return

    try {
      window.sessionStorage.removeItem(REGISTER_WIZARD_STORAGE_KEY)
    } catch {
      // Ignore storage access errors.
    }
  }, [state.success])

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
        goToStep(step + 1)
      }
      return
    }

    const formData = new FormData(event.currentTarget)
    setSubmittedEmail(String(formData.get('email') || ''))
  }

  if (state.success) {
    const provider = getEmailProvider(submittedEmail)

    return (
      <Card
        className={cn(
          'mx-auto w-full overflow-hidden',
          modal
            ? 'flex h-full min-h-0 flex-col max-w-none rounded-none border-0 bg-background/95 shadow-none backdrop-blur-none sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-[2.5rem] sm:border sm:bg-background/60 sm:shadow-2xl sm:backdrop-blur-xl'
            : 'max-w-lg rounded-[2.5rem] border bg-background/60 shadow-2xl backdrop-blur-xl',
        )}
      >
        <CardContent
          className={cn(
            'text-center space-y-8',
            modal ? 'min-h-0 flex-1 overflow-y-auto p-6 sm:p-10' : 'p-10',
          )}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-client-emerald-500/10 border border-client-emerald-500/20">
            <Check className="h-10 w-10 text-client-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">{t('register_success_title')}</h2>
            <p className="text-muted-foreground font-medium">{t('register_success_email_sent')}</p>
            <p className="text-lg font-black text-primary">{submittedEmail}</p>
          </div>

          <div className="p-6 rounded-2xl bg-muted/30 text-sm font-medium text-muted-foreground leading-relaxed">
            {t('register_success_instruction')}
          </div>

          <div className="space-y-4">
            {provider ? (
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary h-14 text-sm font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02]"
              >
                <Mail className="h-5 w-5" />
                {t('open_provider', { provider: provider.name })}
                <ExternalLink className="h-4 w-4 opacity-70" />
              </a>
            ) : (
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm border-2"
                asChild
              >
                <a href="mailto:" target="_blank" rel="noopener noreferrer">
                  <Mail className="mr-2 h-5 w-5" />
                  {t('open_mailbox')}
                </a>
              </Button>
            )}

            <Link href={loginHref} className="block">
              <Button
                variant="ghost"
                className="w-full h-12 font-bold uppercase tracking-widest text-[10px]"
              >
                {t('back_to_login')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'mx-auto w-full overflow-hidden',
        modal
          ? 'flex h-full min-h-0 flex-col max-w-none rounded-none border-0 bg-background/95 shadow-none backdrop-blur-none sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-[2.5rem] sm:border sm:bg-background/60 sm:shadow-2xl sm:backdrop-blur-xl'
          : 'max-w-lg rounded-[2.5rem] border bg-background/60 shadow-2xl backdrop-blur-xl',
      )}
    >
      <CardHeader className="p-8 pb-4 text-center space-y-2">
        <CardTitle className="text-3xl font-black tracking-tight">{t('register')}</CardTitle>
        <CardDescription className="text-sm font-medium">{t('register_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          modal ? 'min-h-0 flex-1 overflow-y-auto p-6 pt-4 sm:p-8 sm:pt-4' : 'p-8 pt-4',
        )}
      >
        <Form action={formAction} onSubmit={handleFormSubmit} className="space-y-8">
          {state.error && (
            <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive font-bold border border-destructive/20 animate-in zoom-in-95">
              {state.error}
            </div>
          )}

          {/* Stepper Progress */}
          <div className="relative flex items-center justify-between px-2">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted/50 -z-10" />
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500',
                  step >= s
                    ? 'bg-primary border-primary text-client-white scale-110 shadow-lg shadow-primary/20'
                    : 'bg-background border-muted text-muted-foreground',
                )}
              >
                {step > s ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <>
                    {s === 1 && <UserCircle className="h-5 w-5" />}
                    {s === 2 && <Lock className="h-5 w-5" />}
                    {s === 3 && <FileCheck className="h-5 w-5" />}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="relative group">
                  <User className="absolute left-4 top-[38px] h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    label={t('first_name')}
                    placeholder={t('first_name_placeholder')}
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                    required
                    autoComplete="given-name"
                    value={formValues.firstName}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, firstName: event.target.value }))
                    }
                  />
                </div>
                <div className="relative group">
                  <User className="absolute left-4 top-[38px] h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    label={t('last_name')}
                    placeholder={t('last_name_placeholder')}
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                    required
                    autoComplete="family-name"
                    value={formValues.lastName}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, lastName: event.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={t('email')}
                  placeholder={t('email_placeholder')}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
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
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
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
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                  required
                  autoComplete="new-password"
                  value={formValues.confirmPassword}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  error={showPasswordMismatch ? t('passwords_mismatch') : undefined}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-black text-sm uppercase tracking-widest">
                      {t('final_step_title')}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {t('final_step_description')}
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 group cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1 h-5 w-5 rounded-lg border-2 border-primary/20 checked:bg-primary transition-all cursor-pointer"
                    checked={formValues.terms}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, terms: event.target.checked }))
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-muted-foreground leading-tight cursor-pointer"
                  >
                    {t('accept_terms')}{' '}
                    <Link href="/terms" className="text-primary font-bold hover:underline">
                      {t('terms_link_label')}
                    </Link>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type={step === totalSteps ? 'submit' : 'button'}
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              onClick={() => {
                if (step < totalSteps && canProceed) {
                  goToStep(step + 1)
                }
              }}
              disabled={!canProceed || isPending}
              loading={step === totalSteps && isPending}
            >
              {step === totalSteps ? t('register_button') : t('continue')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full h-10 font-bold uppercase tracking-widest text-[10px] opacity-60 hover:opacity-100"
                onClick={() => goToStep(step - 1)}
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                {t('previous_step')}
              </Button>
            )}
          </div>

          {/* Hidden inputs for form action */}
          {step !== 1 && (
            <>
              <input type="hidden" name="firstName" value={formValues.firstName} />
              <input type="hidden" name="lastName" value={formValues.lastName} />
            </>
          )}
          {step === 3 && (
            <>
              <input type="hidden" name="email" value={formValues.email} />
              <input type="hidden" name="password" value={formValues.password} />
              <input type="hidden" name="confirmPassword" value={formValues.confirmPassword} />
            </>
          )}
        </Form>
      </CardContent>
      <CardFooter
        className={cn(
          'flex justify-center border-t border-border/50 bg-muted/20',
          modal ? 'shrink-0 p-6 pt-0 sm:p-8 sm:pt-0' : 'p-8 pt-0',
        )}
      >
        <p className="text-sm font-medium text-muted-foreground mt-6">
          {t('already_have_account')}{' '}
          <Link
            href={loginHref}
            className="text-primary font-black hover:underline uppercase tracking-tight"
          >
            {t('login')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
