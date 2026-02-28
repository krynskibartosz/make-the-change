import { connection } from 'next/server'
import { Suspense, type PropsWithChildren } from 'react'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'
import { createClient } from '@/lib/supabase/server'
import { CommunityMobileBottomNav } from './_features/community-mobile-nav'

type CommunityNavUser = {
  id: string
  email: string
  avatarUrl: string | null
} | null

type CommunityLayoutShellProps = PropsWithChildren<{
  user: CommunityNavUser
}>

function CommunityLayoutShell({ children, user }: CommunityLayoutShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
      <CartSheet />
      <CartSnackbar />
      <Suspense fallback={null}>
        <CartDock />
      </Suspense>
      <Suspense fallback={null}>
        <CommunityMobileBottomNav user={user} />
      </Suspense>
    </div>
  )
}

async function CommunityLayoutResolved({ children }: PropsWithChildren) {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileData: { avatar_url: string | null } | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
    profileData = profile
  }

  return (
    <CommunityLayoutShell
      user={user ? { id: user.id, email: user.email || '', avatarUrl: profileData?.avatar_url || null } : null}
    >
      {children}
    </CommunityLayoutShell>
  )
}

function CommunityLayoutFallback({ children }: PropsWithChildren) {
  return <CommunityLayoutShell user={null}>{children}</CommunityLayoutShell>
}

export default function CommunityLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<CommunityLayoutFallback>{children}</CommunityLayoutFallback>}>
      <CommunityLayoutResolved>{children}</CommunityLayoutResolved>
    </Suspense>
  )
}
