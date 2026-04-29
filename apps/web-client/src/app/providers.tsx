'use client'

import { type Brand, AppThemeProvider as ThemeProvider } from '@make-the-change/core'
import { Suspense, type PropsWithChildren } from 'react'
import { SetupGuard } from '@/components/app/setup-guard'
import { Toaster } from '@/components/ui/toaster'

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
      <Toaster>
        <Suspense fallback={null}>
          <SetupGuard />
        </Suspense>
        {children}
      </Toaster>
    </ThemeProvider>
  )
}
