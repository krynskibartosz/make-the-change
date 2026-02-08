'use client'

import type { PropsWithChildren } from 'react'
import { CartProvider } from '@/features/commerce/cart/cart-provider'
import { CartUIProvider } from '@/features/commerce/cart/cart-ui-provider'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <CartUIProvider>{children}</CartUIProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
