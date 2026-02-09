'use client'

import type { PropsWithChildren } from 'react'
import { usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const hiddenRoutes = ['/login', '/register', '/forgot-password', '/cart', '/checkout']

export function MainContent({ children, className }: PropsWithChildren<{ className?: string }>) {
  const pathname = usePathname()

  const isProjectDetail = pathname.startsWith('/projects/') && pathname.split('/').length > 2
  const isProductDetail = pathname.startsWith('/products/') && pathname.split('/').length > 2
  const hideBottomNav =
    hiddenRoutes.some((route) => pathname.startsWith(route)) || isProjectDetail || isProductDetail

  return <main className={cn(hideBottomNav ? 'flex-1' : 'flex-1 pb-24 md:pb-0', className)}>{children}</main>
}
