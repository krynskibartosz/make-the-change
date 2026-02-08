'use client'

import type { FC } from 'react'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import type { UserSummary } from '@/lib/types/user'
import { UserListHeader } from './user-list-header'
import { UserListMetadata } from './user-list-metadata'

type UserListItemProps = {
  user: UserSummary
  actions?: React.ReactNode
}

export const UserListItem: FC<UserListItemProps> = ({ user, actions }) => {
  return (
    <AdminListItem
      actions={actions}
      header={<UserListHeader user={user} />}
      href={`/admin/users/${user.id}`}
      metadata={<UserListMetadata user={user} />}
    />
  )
}
