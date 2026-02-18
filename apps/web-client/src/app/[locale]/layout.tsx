import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import { createClient } from '@/lib/supabase/server'
import { pick } from '@/lib/utils'
import type { Brand, ThemeConfig } from '@make-the-change/core'
import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app'),
  title: {
    template: '%s | Make the Change',
    default: 'Make the Change',
  },
}

type LocaleLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>
  modal: React.ReactNode
}>

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default async function LocaleLayout({ children, modal, params }: LocaleLayoutProps) {
  const resolvedParams = await params
  const locale: Locale = isLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale

  if (resolvedParams.locale !== locale) {
    notFound()
  }

  setRequestLocale(locale)
  const allMessages = await getMessages({ locale })
  // Optimization: Only pass essential namespaces to client to reduce HTML payload size
  // 'marketing' is included because this layout wraps marketing pages which are client-components heavy
  // 'dashboard' and other feature-specific namespaces should be loaded in their specific layouts if needed
  const messages = pick(allMessages, ['common', 'navigation', 'footer', 'ui', 'auth', 'errors', 'marketing', 'home', 'products', 'marketing_pages'])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initialBrand: Brand = 'default'
  let initialCustomVars: Record<string, string> = {}

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()

    const config = profile?.theme_config as unknown as ThemeConfig
    if (config) {
      if (config.activeThemeId) {
        // Multi-theme structure
        const customTheme = config.customThemes?.find((t) => t.id === config.activeThemeId)
        if (customTheme) {
          initialBrand = 'custom'
          initialCustomVars = customTheme.customVars
        } else {
          initialBrand = config.activeThemeId as Brand
        }
      } else if (config.brand) {
        // Legacy structure fallback
        initialBrand = config.brand as Brand
        initialCustomVars = config.customVars || {}
      }
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning className="m-0 p-0 w-full h-full">
      <body className={`m-0 p-0 bg-background text-foreground w-full h-full ${inter.className} ${inter.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers
            initialBrand={initialBrand}
            initialCustomVars={initialCustomVars}
          >
            {children}
            {modal}
          </Providers>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Make the Change',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app'}/projects?search={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              "name": 'Make the Change',
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app',
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app'}/icon.png`,
            }),
          }}
        />
      </body>
    </html>
  )
}
