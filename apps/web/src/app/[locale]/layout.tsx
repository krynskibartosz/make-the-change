import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { Providers } from '@/app/providers'
import { routing } from '@/i18n/routing'

type LocaleLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>
}>

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const LocaleLayout: FC<LocaleLayoutProps> = async ({ children, params }) => {
  const { locale } = await params

  // Vérifier que la locale est supportée
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  // Récupérer les messages pour cette locale
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div className="min-h-screen bg-background text-text">
          <main>{children}</main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  )
}

export default LocaleLayout
