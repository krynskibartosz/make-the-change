import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Providers } from '@/app/providers'
import { createClient } from '@/lib/supabase/server'
import type { Brand, ThemeConfig } from '@make-the-change/core'

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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers 
        initialBrand={initialBrand} 
        initialCustomVars={initialCustomVars}
      >
        {children}
      </Providers>
    </NextIntlClientProvider>
  )
}
