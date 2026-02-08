import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Providers } from '@/app/providers'

type LocaleLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>
}>

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const resolvedParams = await params
  const locale: Locale = isLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale

  if (resolvedParams.locale !== locale) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  )
}
