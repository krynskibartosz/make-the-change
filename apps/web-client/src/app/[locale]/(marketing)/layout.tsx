import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { CartDock } from '@/features/commerce/cart/cart-dock'
import { CartSheet } from '@/features/commerce/cart/cart-sheet'
import { CartSnackbar } from '@/features/commerce/cart/cart-snackbar'
import { getHeaderData } from '@/lib/get-header-data'

export default async function MarketingLayout({ children }: PropsWithChildren) {
  const { user, menuData } = await getHeaderData()

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
      availableLanguage: ['English', 'French', 'Dutch']
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brussels',
      addressCountry: 'BE'
    },
    sameAs: [
      'https://x.com/makethechange',
      'https://www.linkedin.com/company/makethechange',
      'https://www.instagram.com/mtc_impact',
      'https://facebook.com/makethechange',
      'https://tiktok.com/@makethechange'
    ]
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} menuData={menuData} />
      <MainContent>{children}</MainContent>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      <MobileBottomNav user={user ? { id: user.id, email: user.email } : null} />
      <Footer />
    </div>
  )
}
