import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { Providers } from '@/app/providers'
import { routing } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/server'
import type { Brand, ThemeConfig } from '@make-the-change/core'

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
        <div className="min-h-screen bg-background text-foreground">
          <main>{children}</main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  )
}

export default LocaleLayout
