import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/layout/footer'
import { CartDock } from '@/features/commerce/cart/cart-dock'
import { CartSheet } from '@/features/commerce/cart/cart-sheet'
import { CartSnackbar } from '@/features/commerce/cart/cart-snackbar'

export default function BiodexDetailLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* No Header */}
      <main className="flex-1">
        {children}
      </main>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      {/* No MobileBottomNav */}
      <Footer />
    </div>
  )
}
