'use client'

import type { ThemeConfig } from '@make-the-change/core'
import { isLocale, type Locale } from '@make-the-change/core/i18n'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxWithLabel,
  Field,
  Fieldset,
  FieldsetLegend,
  Form,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@make-the-change/core/ui'
import { Check } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { type SettingsState, updateSettings } from './actions'

const languageOptions: Array<{ value: Locale; label: string }> = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Nederlands' },
]

type SettingsClientProps = {
  initial: {
    languageCode: Locale
    timezone: string
    publicProfile: boolean
    marketingConsent: boolean
    notificationPrefs: {
      email: boolean
      push: boolean
      monthly_report: boolean
    }
    socialLinks: {
      linkedin: string
      instagram: string
      twitter: string
    }
    themeConfig: ThemeConfig | null
  }
}

export function SettingsClient({ initial }: SettingsClientProps) {
  const t = useTranslations('dashboard.settings')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(initial.languageCode)
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateSettings, {})

  useEffect(() => {
    if (!state.success || !state.locale || state.locale === locale) {
      return
    }

    router.replace(pathname, { locale: state.locale })
  }, [locale, pathname, router, state.locale, state.success])

  return (
    <div className="space-y-8 max-w-4xl">
      <Card className="border bg-background/70 shadow-sm backdrop-blur overflow-hidden">
        <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-3 sm:p-8 sm:pt-4">
          <Form action={formAction} className="space-y-8">
            {state.error ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            ) : null}
            {state.success ? (
              <div className="flex items-center gap-2 rounded-lg bg-client-emerald-100 p-3 text-sm text-client-emerald-700 dark:bg-client-emerald-900/30 dark:text-client-emerald-400">
                <Check className="h-4 w-4" />
                {state.success}
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 border-b pb-8">
              <Field className="space-y-1.5 w-full">
                <label
                  htmlFor="settings-language"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground dark:text-foreground/80"
                >
                  {t('general.language')}
                </label>
                <Select
                  value={selectedLanguage}
                  onValueChange={(value) => {
                    if (typeof value === 'string' && isLocale(value)) {
                      setSelectedLanguage(value)
                    }
                  }}
                >
                  <SelectTrigger id="settings-language" aria-label={t('general.language')}>
                    <SelectValue placeholder={t('general.language')} />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="languageCode" value={selectedLanguage} />
              </Field>
              <Field>
                <Input
                  name="timezone"
                  label={t('general.timezone')}
                  defaultValue={initial.timezone}
                  placeholder="Europe/Paris"
                />
              </Field>
            </div>

            <Fieldset className="space-y-5 pt-4">
              <FieldsetLegend className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
                {t('privacy.title')}
              </FieldsetLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <CheckboxWithLabel
                  name="publicProfile"
                  defaultChecked={initial.publicProfile}
                  label={t('privacy.public_profile.label')}
                  description={t('privacy.public_profile.description')}
                />

                <CheckboxWithLabel
                  name="marketingConsent"
                  defaultChecked={initial.marketingConsent}
                  label={t('privacy.marketing.label')}
                  description={t('privacy.marketing.description')}
                />
              </div>
            </Fieldset>

            <Fieldset className="space-y-5 pt-6 border-t">
              <FieldsetLegend className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
                {t('socials.title')}
              </FieldsetLegend>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  name="social_linkedin"
                  label={t('socials.linkedin')}
                  defaultValue={initial.socialLinks.linkedin}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  name="social_instagram"
                  label={t('socials.instagram')}
                  defaultValue={initial.socialLinks.instagram}
                  placeholder="@username"
                />
                <Input
                  name="social_twitter"
                  label={t('socials.twitter')}
                  defaultValue={initial.socialLinks.twitter}
                  placeholder="@username"
                />
              </div>
            </Fieldset>

            <div className="pt-8">
              <Button type="submit" loading={isPending} className="w-full py-6 text-base">
                {t('save')}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
