import type { PropsWithChildren } from 'react'
import { CartSheet } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-sheet'
import { CartSnackbar } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-snackbar'
import { CartDock } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-dock'
import { CommunityMobileBottomNav } from './_features/community-mobile-nav'
import { createClient } from '@/lib/supabase/server'

export default async function CommunityLayout({ children }: PropsWithChildren) {
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
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1">{children}</main>
            <CartSheet />
            <CartSnackbar />
            <CartDock />
            <CommunityMobileBottomNav
                user={user ? {
                    id: user.id,
                    email: user.email || '',
                    avatarUrl: profileData?.avatar_url || null
                } : null}
            />
        </div>
    )
}
