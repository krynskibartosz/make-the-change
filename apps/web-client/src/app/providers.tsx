'use client'

import type { PropsWithChildren } from 'react'
import { CartProvider } from '@/features/commerce/cart/cart-provider'
import { CartUIProvider } from '@/features/commerce/cart/cart-ui-provider'
import { AppThemeProvider as ThemeProvider, Brand } from '@make-the-change/core'

interface ProvidersProps extends PropsWithChildren {
  initialBrand?: Brand
  initialCustomVars?: Record<string, string>
}

export function Providers({ children, initialBrand, initialCustomVars }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      initialBrand={initialBrand}
      initialCustomVars={initialCustomVars}
    >
      <CartProvider>
        <CartUIProvider>{children}</CartUIProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
