'use client'

import { Button } from '@make-the-change/core/ui'
import { Briefcase, Menu } from 'lucide-react'
import type { FC } from 'react'
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import { useAdminUiPreferences } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-ui-preferences'

/**
 * Mobile top bar for the admin dashboard.
 *
 * Responsibilities:
 * - Provide access to the primary navigation (sidebar toggle).
 * - Provide quick UI toggles (theme and work mode).
 */
export const AdminMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useAdminSidebar()
  const { workMode, toggleWorkMode } = useAdminUiPreferences()

  return (
    <header className="sticky top-0 z-[45] flex md:hidden items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-md border-b border-[hsl(var(--border)/0.5)]">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Ouvrir le menu de navigation"
          className="p-3 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation"
          size="sm"
          variant="ghost"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">Make the CHANGE</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label={workMode ? 'Désactiver le mode travail' : 'Activer le mode travail'}
          aria-pressed={workMode ? 'true' : 'false'}
          className="p-2 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation"
          size="sm"
          variant={workMode ? 'secondary' : 'ghost'}
          onClick={toggleWorkMode}
        >
          <Briefcase className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
