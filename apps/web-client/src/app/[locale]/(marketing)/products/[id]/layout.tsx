import { getLocale } from 'next-intl/server'
import type { PropsWithChildren } from 'react'

import { MainContent } from '@/components/layout/main-content'
import { getHeaderData } from '@/lib/get-header-data'

export default async function ProductDetailLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const { user, menuData } = await getHeaderData(locale)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MainContent>{children}</MainContent>
      
      {/* MobileBottomNav is intentionally excluded here - replaced by FloatingActionButtons */}
    </div>
  )
}
