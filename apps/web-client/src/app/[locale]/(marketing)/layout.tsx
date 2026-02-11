'use server'

import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MainContent } from '@/components/layout/main-content'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { CartDock } from '@/features/commerce/cart/cart-dock'
import { CartSheet } from '@/features/commerce/cart/cart-sheet'
import { CartSnackbar } from '@/features/commerce/cart/cart-snackbar'
import { getMenu } from '@/features/cms/cms.service'
import { createClient } from '@/lib/supabase/server'

export default async function MarketingLayout({ children }: PropsWithChildren) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [menuData, profileData] = await Promise.all([
    getMenu('main-header'),
    user
      ? supabase.from('profiles').select('avatar_url, metadata').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const headerProfile = profileData.data

  const headerMetadata = headerProfile?.metadata as Record<string, unknown> | null | undefined
  const metadataAvatarUrl = headerMetadata?.avatar_url
  const headerAvatarUrl =
    typeof metadataAvatarUrl === 'string'
      ? metadataAvatarUrl
      : typeof headerProfile?.avatar_url === 'string'
        ? headerProfile.avatar_url
        : null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        user={user ? { id: user.id, email: user.email || '', avatarUrl: headerAvatarUrl } : null}
        menuData={menuData}
      />
      <MainContent>{children}</MainContent>
      <CartSheet />
      <CartSnackbar />
      <CartDock />
      <MobileBottomNav user={user ? { id: user.id, email: user.email || '' } : null} />
      <Footer />
    </div>
  )
}
