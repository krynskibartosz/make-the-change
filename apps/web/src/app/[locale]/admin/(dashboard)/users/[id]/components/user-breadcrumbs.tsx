'use client'

import { ChevronRight, Home, User } from 'lucide-react'
import type { FC } from 'react'
import { LocalizedLink as Link } from '@/components/localized-link'

type UserData = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
}

type UserBreadcrumbsProps = {
  userData: UserData
}

export const UserBreadcrumbs: FC<UserBreadcrumbsProps> = ({ userData }) => {
  const displayName =
    `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-2">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          href="/admin/dashboard"
        >
          <Home className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          href="/admin/users"
        >
          <User className="h-4 w-4" />
          <span>Utilisateurs</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
          {displayName}
        </span>
      </nav>
    </div>
  )
}
