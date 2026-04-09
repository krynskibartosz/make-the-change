'use client'

import { UserDrawer, type UserDrawerUser } from '@/components/layout/user-drawer'

type AdventureStaticHeaderProps = {
  user?: UserDrawerUser
}

export function AdventureStaticHeader({ user = null }: AdventureStaticHeaderProps) {
  return (
    <header className="w-full flex justify-end items-center px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 md:hidden">
      <UserDrawer
        user={user}
        forceUserIcon
        className="h-11 w-11 rounded-full border-0 bg-white/10 text-foreground hover:bg-white/15"
      />
    </header>
  )
}
