'use client'

import { getInitials } from '@make-the-change/core/shared/utils'
import { Badge } from '@make-the-change/core/ui'
import type { FC } from 'react'
import type { UserSummary } from '@/lib/types/user'

type UserListHeaderProps = {
  user: UserSummary
}

export const UserListHeader: FC<UserListHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {}
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        {getInitials(user.name?.split(' ')[0], user.name?.split(' ')[1])}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">{user.name}</h3>

        <Badge color="gray">{user.user_level}</Badge>
      </div>
    </div>
  )
}
