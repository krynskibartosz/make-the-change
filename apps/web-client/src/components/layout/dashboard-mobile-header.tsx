'use client'

import { Button } from '@make-the-change/core/ui'
import { Menu } from 'lucide-react'
import type { FC } from 'react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useDashboardSidebar } from './dashboard-sidebar-context'
import { Logo } from '@/components/ui/logo'

export const DashboardMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useDashboardSidebar()

  return (
    <header className="sticky top-0 z-40 flex lg:hidden items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-md border-b">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Ouvrir le menu de navigation"
          size="icon"
          variant="ghost"
          className="h-11 w-11"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo variant="full" height={32} width={120} className="h-8" />
      </div>
      <ThemeToggle />
    </header>
  )
}
