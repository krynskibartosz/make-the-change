'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { Menu } from 'lucide-react'
import type { FC } from 'react'
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'

export const PartnerMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useAdminSidebar()

  return (
    <header
      className={cn(
        'flex md:hidden items-center justify-between px-4 py-3',
        'bg-background/80 backdrop-blur-xl border-b border-[hsl(var(--border)/0.2)]',
        'sticky top-0 z-30',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-gradient-to-br from-primary to-green-500',
          )}
        >
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="font-semibold text-foreground">Partner Portal</span>
      </div>
      <Button size="icon" variant="ghost" onClick={toggleMobileSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
    </header>
  )
}
