import { getLocale } from 'next-intl/server'
import { Suspense, type PropsWithChildren } from 'react'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { TopNavigation } from '@/components/layout/top-navigation'
import { getHeaderData, type HeaderData } from '@/lib/get-header-data'

type MarketingNoFooterScaffoldProps = PropsWithChildren<{
  user: HeaderData['user']
  menuData: HeaderData['menuData']
}>

function MarketingNoFooterScaffold({
  children,
  user,
  menuData,
}: MarketingNoFooterScaffoldProps) {
  const navUser = user
    ? { id: user.id, email: user.email, avatarUrl: user.avatarUrl, displayName: null }
    : null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} menuData={menuData} />
      <TopNavigation user={navUser} />
      <MainContent className="pt-[calc(env(safe-area-inset-top)+3.5rem)] md:pt-0">
        {children}
      </MainContent>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      <MobileBottomNav user={navUser} />
    </div>
  )
}

async function MarketingNoFooterResolvedLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const { user, menuData } = await getHeaderData(locale)

  return (
    <MarketingNoFooterScaffold user={user} menuData={menuData}>
      {children}
    </MarketingNoFooterScaffold>
  )
}

function MarketingNoFooterFallbackLayout({ children }: PropsWithChildren) {
  return (
    <MarketingNoFooterScaffold user={null} menuData={null}>
      {children}
    </MarketingNoFooterScaffold>
  )
}

export default function MarketingNoFooterLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<MarketingNoFooterFallbackLayout>{children}</MarketingNoFooterFallbackLayout>}>
      <MarketingNoFooterResolvedLayout>{children}</MarketingNoFooterResolvedLayout>
    </Suspense>
  )
}
