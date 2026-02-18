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
import { ArrowLeft, ArrowRight, Check, ExternalLink, Mail, Shield, User, UserCircle, Lock, FileCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FormEvent, useActionState, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { type AuthState, register } from '@/app/[locale]/(auth)/actions'

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

export function RegisterForm() {
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
            <Card className="border bg-background/60 shadow-2xl backdrop-blur-xl rounded-[2.5rem] overflow-hidden w-full max-w-lg mx-auto">
                <CardContent className="p-10 text-center space-y-8">
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

                        <Link href="/login" className="block">
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
        <Card className="border bg-background/60 shadow-2xl backdrop-blur-xl rounded-[2.5rem] overflow-hidden w-full max-w-lg mx-auto">
            <CardHeader className="p-8 pb-4 text-center space-y-2">
                <CardTitle className="text-3xl font-black tracking-tight">{t('register')}</CardTitle>
                <CardDescription className="text-sm font-medium">{t('register_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
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
                                    setStep((prev) => Math.min(prev + 1, totalSteps))
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
                                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
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
            <CardFooter className="p-8 pt-0 flex justify-center border-t border-border/50 bg-muted/20">
                <p className="text-sm font-medium text-muted-foreground mt-6">
                    {t('already_have_account')}{' '}
                    <Link
                        href="/login"
                        className="text-primary font-black hover:underline uppercase tracking-tight"
                    >
                        {t('login')}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
