'use client'

import { type Brand, AppThemeProvider as ThemeProvider } from '@make-the-change/core'
import type { PropsWithChildren } from 'react'
import { CartProvider } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-provider'
import { CartUIProvider } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import { AuthModal } from '@/components/auth/auth-modal'
import { WelcomeSetup } from '@/components/auth/welcome-setup'
import { Toaster } from '@/components/ui/toaster'
import { MockAuthProvider } from '@/lib/mock/mock-auth-context'

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
      {...(initialBrand !== undefined ? { initialBrand } : {})}
      {...(initialCustomVars !== undefined ? { initialCustomVars } : {})}
    >
      <MockAuthProvider>
        <CartProvider>
          <CartUIProvider>
            <Toaster>{children}</Toaster>
          </CartUIProvider>
        </CartProvider>
        {/* Global overlays — order matters: WelcomeSetup above AuthModal */}
        <AuthModal />
        <WelcomeSetup />
      </MockAuthProvider>
    </ThemeProvider>
  )
}

