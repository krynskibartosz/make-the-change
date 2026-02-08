'use client'

import type { FC } from 'react'
import { useAdminUiPreferences } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-ui-preferences'

/**
 * Decorative background grid for the admin dashboard shell.
 *
 * Hidden in work mode to reduce visual noise and improve cognitive fluency.
 */
export const AdminBackgroundGrid: FC = () => {
  const { workMode } = useAdminUiPreferences()
  if (workMode) return null

  return (
    <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
