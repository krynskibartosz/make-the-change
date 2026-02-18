import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/layout/footer'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'

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
