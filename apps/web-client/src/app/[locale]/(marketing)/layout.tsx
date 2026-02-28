import { getLocale } from 'next-intl/server'
import { Suspense, type PropsWithChildren } from 'react'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { getHeaderData, type HeaderData } from '@/lib/get-header-data'

type MarketingScaffoldProps = PropsWithChildren<{
  user: HeaderData['user']
  menuData: HeaderData['menuData']
}>

function MarketingScaffold({ children, user, menuData }: MarketingScaffoldProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Make the Change',
    url: 'https://make-the-change-web-client.vercel.app',
    logo: 'https://make-the-change-web-client.vercel.app/images/logo-full.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+32-2-000-00-00',
      contactType: 'customer service',
      email: 'contact@make-the-change.com',
      areaServed: ['BE', 'FR', 'NL'],
      availableLanguage: ['English', 'French', 'Dutch'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brussels',
      addressCountry: 'BE',
      // Note: Full address pending from business owner
    },
    location: {
      '@type': 'Place',
      name: 'Make the Change - Innovation Lab',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Avenue de France (Example)', // Placeholder or remove if strictly unknown
        addressLocality: 'Paris',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8566,
        longitude: 2.3522,
      },
    },
    sameAs: [
      'https://x.com/makethechange',
      'https://www.linkedin.com/company/makethechange',
      'https://www.instagram.com/mtc_impact',
      'https://facebook.com/makethechange',
      'https://tiktok.com/@makethechange',
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} menuData={menuData} />
      <MainContent>{children}</MainContent>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      <MobileBottomNav user={user ? { id: user.id, email: user.email } : null} />
      <Footer />
    </div>
  )
}

async function MarketingResolvedLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const { user, menuData } = await getHeaderData(locale)

  return (
    <MarketingScaffold user={user} menuData={menuData}>
      {children}
    </MarketingScaffold>
  )
}

function MarketingFallbackLayout({ children }: PropsWithChildren) {
  return (
    <MarketingScaffold user={null} menuData={null}>
      {children}
    </MarketingScaffold>
  )
}

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<MarketingFallbackLayout>{children}</MarketingFallbackLayout>}>
      <MarketingResolvedLayout>{children}</MarketingResolvedLayout>
    </Suspense>
  )
}
