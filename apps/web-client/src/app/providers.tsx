'use client'

import { type Brand, AppThemeProvider as ThemeProvider } from '@make-the-change/core'
import type { PropsWithChildren } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-provider'
import { CartUIProvider } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'

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
        <CartUIProvider>
          <Toaster>{children}</Toaster>
        </CartUIProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
