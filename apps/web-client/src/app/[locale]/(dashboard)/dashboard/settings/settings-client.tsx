'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxWithLabel,
  Input,
} from '@make-the-change/core/ui'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { type SettingsState, updateSettings } from './actions'
import type { ThemeConfig } from '@make-the-change/core'

type SettingsClientProps = {
  initial: {
    languageCode: string
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
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateSettings, {})

  return (
    <div className="space-y-8 max-w-4xl">
      <Card className="border bg-background/70 shadow-sm backdrop-blur overflow-hidden">
        <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-3 sm:p-8 sm:pt-4">
          <form action={formAction} className="space-y-8">
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
              <Input
                name="languageCode"
                label={t('general.language')}
                defaultValue={initial.languageCode}
                placeholder="fr"
              />
              <Input
                name="timezone"
                label={t('general.timezone')}
                defaultValue={initial.timezone}
                placeholder="Europe/Paris"
              />
            </div>

            <div className="space-y-5 pt-4">
              <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">{t('privacy.title')}</p>
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
            </div>

            <div className="space-y-5 pt-6 border-t">
              <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">{t('socials.title')}</p>
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
            </div>

            <div className="pt-8">
              <Button type="submit" loading={isPending} className="w-full py-6 text-base">
                {t('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
