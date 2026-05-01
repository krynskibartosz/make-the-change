import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'

export default async function OnboardingPage() {
  const locale = await getLocale()
  redirect({ href: '/onboarding/step-0', locale })
}
