import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CommunityPageFrameClient } from './community-page-frame-client'

export type CommunitySidebarUser = {
  id: string
  email: string
  avatarUrl: string | null
  displayName: string
} | null

type CommunityPageFrameProps = {
  children: ReactNode
  rightRail?: ReactNode
  sidebarUser?: CommunitySidebarUser
  centerClassName?: string
  rightRailClassName?: string
}

const resolveDisplayName = (input: {
  email: string | null | undefined
  firstName: string | null | undefined
  lastName: string | null | undefined
}) => {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ')
  if (fullName) {
    return fullName
  }

  return input.email || ''
}

export async function getCommunitySidebarUser(): Promise<CommunitySidebarUser> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email || '',
    avatarUrl: profile?.avatar_url || null,
    displayName: resolveDisplayName({
      email: user.email,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
    }),
  }
}

export async function CommunityPageFrame({
  children,
  rightRail,
  sidebarUser,
  centerClassName,
  rightRailClassName,
}: CommunityPageFrameProps) {
  const resolvedSidebarUser =
    sidebarUser === undefined ? await getCommunitySidebarUser() : sidebarUser

  return (
    <CommunityPageFrameClient
      sidebarUser={resolvedSidebarUser}
      centerClassName={centerClassName}
      rightRailClassName={rightRailClassName}
      rightRail={rightRail}
    >
      {children}
    </CommunityPageFrameClient>
  )
}
