import type { PropsWithChildren } from 'react'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { getHeaderData } from '@/lib/get-header-data'

export default async function ProductDetailLayout({ children }: PropsWithChildren) {
  const { user, menuData } = await getHeaderData()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} menuData={menuData} />
      <MainContent>{children}</MainContent>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      {/* MobileBottomNav is intentionally excluded here - replaced by FloatingActionButtons */}
    </div>
  )
}
