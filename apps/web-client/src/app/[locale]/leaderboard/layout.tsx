import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { CartDock } from '@/features/commerce/cart/cart-dock'
import { CartSheet } from '@/features/commerce/cart/cart-sheet'
import { CartSnackbar } from '@/features/commerce/cart/cart-snackbar'
import { getHeaderData } from '@/lib/get-header-data'

export default async function LeaderboardLayout({ children }: PropsWithChildren) {
  const { user, menuData } = await getHeaderData()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} menuData={menuData} />
      <MainContent>{children}</MainContent>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      <MobileBottomNav user={user ? { id: user.id, email: user.email } : null} />
      <Footer />
    </div>
  )
}
